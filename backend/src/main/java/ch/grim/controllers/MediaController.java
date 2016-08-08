package ch.grim.controllers;

import ch.grim.models.DiscoverResultPage;
import ch.grim.models.Movie;
import ch.grim.models.MovieBookmark;
import ch.grim.models.User;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.TmdbDiscover;
import info.movito.themoviedbapi.model.Discover;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletRequest;
import java.util.Collection;
import java.util.Collections;
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

    private MovieBookmarkRepository bookmarksJpa;

    @Autowired
    public MediaController(MovieDBService service, MovieBookmarkRepository repo) {
        this.service = service;
        this.bookmarksJpa = repo;
    }

    @RequestMapping("/configuration")
    public TmdbConfiguration getConfiguration() {
        return service.getConfiguration();
    }

    @RequestMapping("/discover")
    public DiscoverResultPage discover(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") int page) {

        TmdbDiscover discover = service.discover();
        Discover params = new Discover();
        params.page(page);

        Collection<MovieBookmark> bookmarks;
        if (user != null) {
            bookmarks = bookmarksJpa.findByAccountId(user.getId());
            LOG.info(String.format("Found %d bookmarks for user: %s", bookmarks.size(), user.getUsername()));
        } else {
            bookmarks = Collections.emptyList();
        }

        return new DiscoverResultPage(discover.getDiscover(params), bookmarks);
    }

    @RequestMapping("/movie/{id}")
    public Movie movie(ServletRequest request,
                         @AuthenticationPrincipal User user,
                         @PathVariable int id) {

        MovieDb movie = service.getMovie(id, request.getLocale().getLanguage());

        MovieBookmark bookmark = null;
        if (user != null) {
            Optional<MovieBookmark> option = bookmarksJpa.findByAccountIdAndMovieId(user.getId(), id);
            if (option.isPresent()) {
                bookmark = option.get();
            }
        }

        return new Movie(movie, bookmark);
    }
}
