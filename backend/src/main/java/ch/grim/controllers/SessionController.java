package ch.grim.controllers;

import ch.grim.models.Account;
import ch.grim.models.Movie;
import ch.grim.models.MovieBookmark;
import ch.grim.models.User;
import ch.grim.repositories.AccountRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.model.MovieDb;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.security.auth.login.AccountNotFoundException;
import javax.servlet.ServletRequest;
import java.util.Collection;
import java.util.List;
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

    private MovieBookmarkRepository bookmarksJpa;

    @Autowired
    public SessionController(AccountRepository accounts, MovieBookmarkRepository bookmarks, MovieDBService service) {
        this.accountsJpa = accounts;
        this.bookmarksJpa = bookmarks;
        this.service = service;
    }


    @RequestMapping("/me")
    public User me(@AuthenticationPrincipal User user) {

        Account account = accountsJpa.findOne(user.getId());
        return new User(account);
    }

    @RequestMapping(value = "/me/movies")
    public List<Movie> getMovies(@AuthenticationPrincipal User user, ServletRequest request) {

        Collection<MovieBookmark> bookmarks = bookmarksJpa.findByAccountUsername(user.getUsername());

        return bookmarks
                .stream()
                .map(bm -> new Movie(service.getMovie(bm.getMovieId(), request.getLocale().getLanguage()), bm))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/me/movies/{id}", method = RequestMethod.POST)
    public ResponseEntity<String> addMovie(@AuthenticationPrincipal User user, @PathVariable int id) throws Exception {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        if (account.getBookmarks().stream().filter(bm -> bm.getMovieId().equals(id)).count() == 0) {
            account.getBookmarks().add(bookmarksJpa.save(new MovieBookmark(account, id)));
        }

        return new ResponseEntity<>("Ok", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/me/movies/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> removeMovie(@AuthenticationPrincipal User user, @PathVariable int id) throws Exception {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        Collection<MovieBookmark> bookmarks = account.getBookmarks().stream()
                .filter(bm -> bm.getMovieId().equals(id))
                .collect(Collectors.toList());

        account.getBookmarks().removeAll(bookmarks);

        LOG.debug(bookmarks.size() + " bookmarks found for user " + user.getUsername());
        bookmarksJpa.delete(bookmarks);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
