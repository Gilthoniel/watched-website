package ch.grim.controllers;

import ch.grim.models.json.DiscoverJson;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.TmdbDiscover;
import info.movito.themoviedbapi.model.Discover;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletRequest;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@Controller
@ResponseBody
@RequestMapping("${spring.data.rest.base-path}/media")
public class MediaController {

    private static final Logger LOG = LoggerFactory.getLogger(MediaController.class);

    private MovieDBService service;

    @Autowired
    public MediaController(MovieDBService service) {
        this.service = service;
    }

    @RequestMapping("/configuration")
    public TmdbConfiguration getConfiguration() {
        return service.getConfiguration();
    }

    @RequestMapping("/discover")
    public DiscoverJson discover(@RequestParam(defaultValue = "1") int page) {
        TmdbDiscover discover = service.discover();
        Discover params = new Discover();
        params.page(page);

        return new DiscoverJson(discover.getDiscover(params));
    }

    @RequestMapping("/movie/{id}")
    public MovieDb movie(ServletRequest request, @PathVariable int id) {
        return service.getMovie(id, request.getLocale().getISO3Language());
    }
}
