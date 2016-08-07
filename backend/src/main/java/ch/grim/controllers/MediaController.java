package ch.grim.controllers;

import ch.grim.models.DiscoverResultPage;
import ch.grim.models.MovieBookmark;
import ch.grim.models.User;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.TmdbDiscover;
import info.movito.themoviedbapi.model.Discover;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.persistence.CollectionTable;
import javax.servlet.ServletRequest;
import java.security.Principal;
import java.util.Collection;
import java.util.Collections;

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
            Principal principal,
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "1") int page)
    {
        TmdbDiscover discover = service.discover();
        Discover params = new Discover();
        params.page(page);

        Collection<MovieBookmark> bookmarks;
        if (user != null) {
            bookmarks = bookmarksJpa.findByAccountUsername(user.getUsername());
            LOG.info(String.format("Found %d bookmarks for user: %s", bookmarks.size(), user.getUsername()));
        } else {
            bookmarks = Collections.emptyList();
        }

        return new DiscoverResultPage(discover.getDiscover(params), bookmarks);
    }

    @RequestMapping("/movie/{id}")
    public MovieDb movie(ServletRequest request, @PathVariable int id) {
        return service.getMovie(id, request.getLocale().getISO3Language());
    }
}
