package ch.grim.services;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbDiscover;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by Gaylor on 31.07.2016.
 * Service to request information from TheMovieDB
 */
@Service
public class MovieDBService {

    private static final TmdbApi api = new TmdbApi("206f79eda0e7499536358bbfd3e47743");

    public TmdbDiscover discover() {
        return api.getDiscover();
    }

    public MovieDb getMovie(int id, String lang) {
        return api.getMovies().getMovie(id, lang);
    }

    @Cacheable(cacheNames = "moviedb-configuration", sync=true)
    public TmdbConfiguration getConfiguration() {
        return api.getConfiguration();
    }
}
