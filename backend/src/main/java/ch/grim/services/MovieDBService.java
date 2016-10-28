package ch.grim.services;

import info.movito.themoviedbapi.*;
import info.movito.themoviedbapi.model.FindResults;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.tv.TvSeason;
import info.movito.themoviedbapi.model.tv.TvSeries;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by Gaylor on 31.07.2016.
 * Service to request information from TheMovieDB
 */
@Service
public class MovieDBService {

    private static final TmdbApi api = new TmdbApi("206f79eda0e7499536358bbfd3e47743");

    @Cacheable(cacheNames = "moviedb-search-#query-#lang-#page")
    public TmdbSearch.MultiListResultsPage search(String query, String lang, int page) {
        return api.getSearch().searchMulti(query, lang, page);
    }

    @Cacheable(cacheNames = "moviedb-searchMovie-movie-#query-#lang-#page")
    public MovieResultsPage searchMovie(String query, String lang, int page) {
        return api.getSearch().searchMovie(query, 0, lang, true, page);
    }

    @Cacheable(cacheNames = "moviedb-searchMovie-tv-#query-#lang-#page")
    public TvResultsPage searchTv(String query, String lang, int page) {
        return api.getSearch().searchTv(query, lang, page);
    }

    @Cacheable(cacheNames = "moviedb-discover")
    public TmdbDiscover discover() {
        return api.getDiscover();
    }

    @Cacheable(cacheNames = "moviedb-movie-#id", sync = true)
    public MovieDb getMovie(int id, String lang) {
        return api.getMovies().getMovie(id, lang, TmdbMovies.MovieMethod.keywords);
    }

    @Cacheable(cacheNames = "moviedb-tv-#id")
    public TvSeries getTvShow(int id, String lang) {
        return api.getTvSeries().getSeries(id, lang);
    }

    @Cacheable(cacheNames = "moviedb-tv-#serieId-#season")
    public TvSeason getSeriesSeason(int serieId, int season, String lang) {
        return api.getTvSeasons().getSeason(serieId, season, lang);
    }

    @Cacheable(cacheNames = "moviedb-configuration", sync = true)
    public TmdbConfiguration getConfiguration() {
        return api.getConfiguration();
    }
}
