package ch.grim.controllers;

import ch.grim.models.*;
import ch.grim.repositories.AccountRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.repositories.SeriesBookmarkRepository;
import ch.grim.services.MovieDBService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import javax.servlet.ServletRequest;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@RequestMapping("${spring.data.rest.base-path}/users")
@RestController
class SessionController {

    private static final Logger LOG = LoggerFactory.getLogger(SessionController.class);

    private MovieDBService service;

    private AccountRepository accountsJpa;

    private MovieBookmarkRepository moviesBmJpa;
    private SeriesBookmarkRepository seriesBmJpa;

    @Autowired
    public SessionController(AccountRepository accounts, MovieBookmarkRepository bookmarks, SeriesBookmarkRepository repo, MovieDBService service) {
        this.accountsJpa = accounts;
        this.moviesBmJpa = bookmarks;
        this.seriesBmJpa = repo;
        this.service = service;
    }


    @RequestMapping("/me")
    public User me(@AuthenticationPrincipal User user) {

        Account account = accountsJpa.findOne(user.getId());
        return new User(account);
    }

    @RequestMapping(value = "/me/movies")
    public List<Movie> getMovies(@AuthenticationPrincipal User user, ServletRequest request) {

        Collection<MovieBookmark> bookmarks = moviesBmJpa.findByAccountId(user.getId());

        return bookmarks
                .stream()
                .map(bm -> new Movie(service.getMovie(bm.getMovieId(), request.getLocale().getLanguage()), bm))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/me/movies/{id}", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public MovieBookmark setMovieBookmark(
            ServletRequest request,
            @AuthenticationPrincipal User user,
            @PathVariable int id) throws Exception {

        Boolean watched = Boolean.parseBoolean(request.getParameter("watched"));

        Optional<MovieBookmark> bookmark = moviesBmJpa.findByAccountIdAndMovieId(user.getId(), id);
        if (!bookmark.isPresent()) {
            Account account = accountsJpa.findOne(user.getId());
            if (account == null) {
                throw new AccountNotFoundException();
            }

            return moviesBmJpa.save(new MovieBookmark(account, id, watched));
        } else {
            moviesBmJpa.setWatchedByAccountIdAndMovieId(user.getId(), id, watched);
            bookmark.get().setWatched(watched);
            return bookmark.get();
        }
    }

    @RequestMapping(value = "/me/movies/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> removeMovieBookmark(@AuthenticationPrincipal User user, @PathVariable int id) throws Exception {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        Collection<MovieBookmark> bookmarks = account.getBookmarks().stream()
                .filter(bm -> bm.getMovieId().equals(id))
                .collect(Collectors.toList());

        account.getBookmarks().removeAll(bookmarks);

        LOG.debug(bookmarks.size() + " bookmarks found for user " + user.getUsername());
        moviesBmJpa.delete(bookmarks);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping("/me/series")
    public List<Series> getSeries(ServletRequest request, @AuthenticationPrincipal User user) {

        Collection<SeriesBookmark> bookmarks = seriesBmJpa.findByAccountId(user.getId());

        return bookmarks.stream()
                .map(bm -> new Series(service.getTvShow(bm.getSeriesId(), request.getLocale().getLanguage()), bm))
                .collect(Collectors.toList());
    }
}
