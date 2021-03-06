package ch.grim.controllers;

import ch.grim.controllers.errors.BookmarkMissingException;
import ch.grim.models.*;
import ch.grim.repositories.AccountRepository;
import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.repositories.SeriesBookmarkRepository;
import ch.grim.services.MovieDBService;
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

    @RequestMapping(value = "/me/bookmarks")
    public Map<String, Collection<Object>> getBookmarks(@AuthenticationPrincipal User user, ServletRequest request) {

        Map<String, Collection<Object>> map = new HashMap<>();

        // Get the movies
        Collection<MovieBookmark> bookmarks = moviesBmJpa.findByAccountId(user.getId());
        map.put("movies", bookmarks.stream()
                .map(bm -> new Movie(service.getMovie(bm.getMovieId(), request.getLocale().getLanguage()), bm))
                .collect(Collectors.toList()));

        // Get the Series
        Collection<SeriesBookmark> seriesBookmarks = seriesBmJpa.findByAccountId(user.getId());
        map.put("series", seriesBookmarks.stream()
                .map(bm -> {
                    int total = episodesBmJpa.findByAccountIdAndSerieId(user.getId(), bm.getSeriesId()).size();

                    return new Series(service.getTvShow(bm.getSeriesId(), request.getLocale().getLanguage()), bm, total);
                })
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

        MovieBookmark bookmark = moviesBmJpa.findByAccountIdAndMovieId(user.getId(), id)
                .orElseThrow(BookmarkMissingException::new);

        moviesBmJpa.delete(bookmark);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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

        SeriesBookmark bookmark = seriesBmJpa.findByAccountIdAndSeriesId(user.getId(), id)
                .orElseThrow(BookmarkMissingException::new);

        seriesBmJpa.delete(bookmark);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/me/episodes/bookmark", method = RequestMethod.POST)
    public EpisodeBookmark setEpisodeBookmark(
            @AuthenticationPrincipal User user,
            @RequestBody Episode episode) throws AccountNotFoundException {

        Optional<EpisodeBookmark> bookmark = episodesBmJpa.findByAccountIdAndSerieIdAndEpisodeId(
                user.getId(), episode.getSeriesId(), episode.getId());

        if (!bookmark.isPresent()) {

            Account account = accountsJpa.findOne(user.getId());
            if (account == null) {
                throw new AccountNotFoundException();
            }

            return episodesBmJpa.save(new EpisodeBookmark(account, episode));

        } else {
            return bookmark.get();
        }
    }

    @RequestMapping(value = "/me/episodes/bookmark", method = RequestMethod.DELETE)
    public ResponseEntity<String> removeEpisodeBookmark(
            @AuthenticationPrincipal User user,
            @RequestBody Episode episode) throws AccountNotFoundException {

        EpisodeBookmark bookmark = episodesBmJpa
                .findByAccountIdAndSerieIdAndEpisodeId(user.getId(), episode.getSeriesId(), episode.getId())
                .orElseThrow(BookmarkMissingException::new);

        episodesBmJpa.delete(bookmark);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

    @RequestMapping(value = "/me/season/{seriesId}/{seasonNumber}", method = RequestMethod.POST)
    public Collection<Episode> setSeasonBookmarks(
            ServletRequest request,
            @AuthenticationPrincipal User user,
            @PathVariable int seriesId,
            @PathVariable int seasonNumber) throws AccountNotFoundException {

        List<Episode> episodes = new LinkedList<>();

        Account account = accountsJpa.findOne(user.getId());
        if (account == null) {
            throw new AccountNotFoundException();
        }

        Collection<EpisodeBookmark> bookmarks = episodesBmJpa.findByAccountIdAndSerieId(user.getId(), seriesId);

        service.getSeriesSeason(seriesId, seasonNumber, request.getLocale().getLanguage()).getEpisodes()
                .forEach(episode -> {
                    Optional<EpisodeBookmark> oBookmark =
                            bookmarks.stream().filter(bm -> bm.getEpisodeId() == episode.getId()).findFirst();

                    if (!oBookmark.isPresent()) {
                        EpisodeBookmark bookmark = episodesBmJpa.save(new EpisodeBookmark(account, episode, seriesId));
                        episodes.add(new Episode(episode, seriesId, bookmark));
                    } else {
                        episodes.add(new Episode(episode, seriesId, oBookmark.get()));
                    }
                });

        return episodes;
    }

    @RequestMapping(value = "/me/season/{seriesId}/{seasonNumber}", method = RequestMethod.DELETE)
    public ResponseEntity<?> removeSeasonBookmarks(
            @AuthenticationPrincipal User user,
            @PathVariable int seriesId,
            @PathVariable int seasonNumber) throws Exception {

        Collection<EpisodeBookmark> bookmarks = episodesBmJpa.findByAccountIdAndSerieId(user.getId(), seriesId)
                .stream()
                .filter(bm -> bm.getSeasonNumber() == seasonNumber)
                .collect(Collectors.toList());

        episodesBmJpa.delete(bookmarks);
        return new ResponseEntity(HttpStatus.OK);
    }

}
