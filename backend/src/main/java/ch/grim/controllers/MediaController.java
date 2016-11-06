package ch.grim.controllers;

import ch.grim.models.*;
import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.repositories.SeriesBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.TmdbDiscover;
import info.movito.themoviedbapi.TmdbSearch;
import info.movito.themoviedbapi.TvResultsPage;
import info.movito.themoviedbapi.model.Discover;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.tv.TvSeries;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.Servlet;
import javax.servlet.ServletRequest;
import java.util.Collection;
import java.util.Collections;
import java.util.IllegalFormatCodePointException;
import java.util.Optional;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@RestController
@RequestMapping("${spring.data.rest.base-path}/media")
public class MediaController {

    private static final Logger LOG = LoggerFactory.getLogger(MediaController.class);

    private MovieDBService service;

    private final MovieBookmarkRepository movieBmJpa;
    private final SeriesBookmarkRepository seriesBmJpa;
    private final EpisodeBookmarkRepository episodeBmJpa;

    @Autowired
    public MediaController(MovieDBService service, MovieBookmarkRepository movieBmJpa,
                           SeriesBookmarkRepository seriesBmJpa, EpisodeBookmarkRepository episodeBmJpa) {
        this.service = service;
        this.movieBmJpa = movieBmJpa;
        this.seriesBmJpa = seriesBmJpa;
        this.episodeBmJpa = episodeBmJpa;
    }

    @RequestMapping("/configuration")
    public TmdbConfiguration getConfiguration() {
        return service.getConfiguration();
    }

    @RequestMapping("/search")
    public SearchPage search(
            ServletRequest request,
            @AuthenticationPrincipal User user,
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        TmdbSearch.MultiListResultsPage results = service.search(query, request.getLocale().getLanguage(), page);

        Collection<MovieBookmark> moviesBm;
        if (user != null) {
            moviesBm = movieBmJpa.findByAccountId(user.getId());
            LOG.debug(String.format("Found %d bookmarks for user: %s", moviesBm.size(), user.getUsername()));
        } else {
            moviesBm = Collections.emptyList();
        }

        Collection<SeriesBookmark> seriesBm;
        if (user != null) {
            seriesBm = seriesBmJpa.findByAccountId(user.getId());
        } else {
            seriesBm = Collections.emptyList();
        }

        SearchPage response = new SearchPage(results, moviesBm, seriesBm);
        if (user != null) {
            response.fillNumberWatchedEpisodes(service, episodeBmJpa, user.getId(), request.getLocale().getLanguage());
        }

        return response;
    }

    @RequestMapping("/search/movie")
    public DiscoverResultPage searchMovie(
            ServletRequest request,
            @AuthenticationPrincipal User user,
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {

        MovieResultsPage results = service.searchMovie(query, request.getLocale().getLanguage(), page);

        Collection<MovieBookmark> bookmarks;
        if (user != null) {
            bookmarks = movieBmJpa.findByAccountId(user.getId());
            LOG.debug(String.format("Found %d bookmarks for user: %s", bookmarks.size(), user.getUsername()));
        } else {
            bookmarks = Collections.emptyList();
        }

        return new DiscoverResultPage(results, bookmarks);
    }

    @RequestMapping("/search/tv")
    public SeriesSearchResults searchTv(
            ServletRequest request,
            @AuthenticationPrincipal User user,
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {

        TvResultsPage results = service.searchTv(query, request.getLocale().getLanguage(), page);

        Collection<SeriesBookmark> bookmarks;
        if (user != null) {
            bookmarks = seriesBmJpa.findByAccountId(user.getId());
        } else {
            bookmarks = Collections.emptyList();
        }

        SeriesSearchResults response = new SeriesSearchResults(results, bookmarks);
        if (user != null) {
            response.fillNumberWatchedEpisodes(service, episodeBmJpa, user.getId(), request.getLocale().getLanguage());
        }

        return response;
    }

    @RequestMapping("/discover")
    public DiscoverResultPage discover(
            ServletRequest request,
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") int page) {

        Collection<MovieBookmark> bookmarks;
        if (user != null) {
            bookmarks = movieBmJpa.findByAccountId(user.getId());
        } else {
            bookmarks = Collections.emptyList();
        }

        return new DiscoverResultPage(service.discover(page, request.getLocale().getLanguage()), bookmarks);
    }

    @RequestMapping("/movie/{id}")
    public Movie movie(ServletRequest request,
                         @AuthenticationPrincipal User user,
                         @PathVariable int id) {

        MovieDb movie = service.getMovie(id, request.getLocale().getLanguage());

        MovieBookmark bookmark = null;
        if (user != null) {
            Optional<MovieBookmark> option = movieBmJpa.findByAccountIdAndMovieId(user.getId(), id);
            if (option.isPresent()) {
                bookmark = option.get();
            }
        }

        return new Movie(movie, bookmark);
    }

    @RequestMapping("/series/{id}")
    public Series tvShow(ServletRequest request,
                         @AuthenticationPrincipal User user,
                         @PathVariable int id) {

        TvSeries series = service.getTvShow(id, request.getLocale().getLanguage());

        SeriesBookmark bookmark = null;
        if (user != null) {
            Optional<SeriesBookmark> option = seriesBmJpa.findByAccountIdAndSeriesId(user.getId(), id);
            if (option.isPresent()) {
                bookmark = option.get();
            }
        }

        Series response = new Series(series, bookmark);
        response.loadEpisodes(service, id, request.getLocale().getLanguage());
        if (user != null) {
            response.loadBookmarks(episodeBmJpa, user.getId());
        }

        return response;
    }
}
