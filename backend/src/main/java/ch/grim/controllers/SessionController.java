package ch.grim.controllers;

import ch.grim.models.*;
import ch.grim.repositories.AccountRepository;
import ch.grim.repositories.EpisodeBookmarkRepository;
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
import java.util.*;
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
    private EpisodeBookmarkRepository episodesBmJpa;

    @Autowired
    public SessionController(AccountRepository accounts, MovieBookmarkRepository bookmarks,
                             SeriesBookmarkRepository repo, EpisodeBookmarkRepository repo2, MovieDBService service) {
        this.accountsJpa = accounts;
        this.moviesBmJpa = bookmarks;
        this.seriesBmJpa = repo;
        this.episodesBmJpa = repo2;
        this.service = service;
    }


    @RequestMapping("/me")
    public User me(@AuthenticationPrincipal User user) {

        Account account = accountsJpa.findOne(user.getId());
        return new User(account);
    }

    @RequestMapping(value = "/me/movies")
    public Map<String, Collection<Object>> getMovies(@AuthenticationPrincipal User user, ServletRequest request) {

        Map<String, Collection<Object>> map = new HashMap<>();

        // Get the movies
        Collection<MovieBookmark> bookmarks = moviesBmJpa.findByAccountId(user.getId());
        map.put("movies", bookmarks.stream()
                .map(bm -> new Movie(service.getMovie(bm.getMovieId(), request.getLocale().getLanguage()), bm))
                .collect(Collectors.toList()));

        // Get the Series
        Collection<SeriesBookmark> seriesBookmarks = seriesBmJpa.findByAccountId(user.getId());
        map.put("series", seriesBookmarks.stream()
                .map(bm -> new Series(service.getTvShow(bm.getSeriesId(), request.getLocale().getLanguage()), bm))
                .collect(Collectors.toList()));

        return map;
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

    @RequestMapping(value = "/me/series/{id}", method = RequestMethod.POST)
    public SeriesBookmark setSeriesBookmark(
            @AuthenticationPrincipal User user,
            @PathVariable int id) throws AccountNotFoundException {

        Optional<SeriesBookmark> bookmark = seriesBmJpa.findByAccountIdAndSeriesId(user.getId(), id);
        if (!bookmark.isPresent()) {
            Account account = accountsJpa.findOne(user.getId());
            if (account == null) {
                throw new AccountNotFoundException();
            }

            return seriesBmJpa.save(new SeriesBookmark(account, id));

        } else {
            return bookmark.get();
        }
    }

    @RequestMapping(value = "/me/series/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> removeSeriesBookmark(@AuthenticationPrincipal User user, @PathVariable int id)
        throws AccountNotFoundException {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        Collection<SeriesBookmark> bookmarks = account.getSeriesBookmarks().stream()
                .filter(bm -> bm.getSeriesId() == id)
                .collect(Collectors.toList());

        account.getSeriesBookmarks().removeAll(bookmarks);

        LOG.debug(bookmarks.size() + " series bookmarks found for user " + user.getUsername());
        seriesBmJpa.delete(bookmarks);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/me/episodes/{serieId}/{episodeId}", method = RequestMethod.POST)
    public EpisodeBookmark setEpisodeBookmark(
            @AuthenticationPrincipal User user,
            @PathVariable int serieId,
            @PathVariable int episodeId) throws AccountNotFoundException {

        Optional<EpisodeBookmark> bookmark = episodesBmJpa.findByAccountIdAndSerieIdAndEpisodeId(user.getId(), serieId, episodeId);
        if (!bookmark.isPresent()) {

            Account account = accountsJpa.findOne(user.getId());
            if (account == null) {
                throw new AccountNotFoundException();
            }

            return episodesBmJpa.save(new EpisodeBookmark(account, serieId, episodeId));

        } else {
            return bookmark.get();
        }
    }

    @RequestMapping(value = "/me/episodes/{serieId}/{episodeId}", method = RequestMethod.DELETE)
    public ResponseEntity<String> removeEpisodeBookmark(
            @AuthenticationPrincipal User user,
            @PathVariable int serieId,
            @PathVariable int episodeId) throws AccountNotFoundException {

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        Collection<EpisodeBookmark> bookmarks = account.getEpisodeBookmarks().stream()
                .filter(bm -> bm.getSerieId() == serieId && bm.getEpisodeId() == episodeId)
                .collect(Collectors.toList());

        account.getEpisodeBookmarks().removeAll(bookmarks);

        LOG.debug(bookmarks.size() + " episodes bookmarks found for user " + user.getUsername());
        episodesBmJpa.delete(bookmarks);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

}
