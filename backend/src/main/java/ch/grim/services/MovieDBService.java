package ch.grim.services;

import info.movito.themoviedbapi.*;
import info.movito.themoviedbapi.model.Discover;
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

    @Cacheable(value = "movie-db", key = "'search-' + #query + #lang + #page")
    public TmdbSearch.MultiListResultsPage search(String query, String lang, int page) {
        return api.getSearch().searchMulti(query, lang, page, false);
    }

    @Cacheable(value = "movie-db", key = "'searchMovie-' + #query + #lang + #page")
    public MovieResultsPage searchMovie(String query, String lang, int page) {
        return api.getSearch().searchMovie(query, 0, lang, false, page);
    }

    @Cacheable(value = "movie-db", key = "'searchTV-' + #query + #lang + #page")
    public TvResultsPage searchTv(String query, String lang, int page) {
        return api.getSearch().searchTv(query, lang, page);
    }

    @Cacheable(value = "movie-db", key = "'discover-' + #page + #lang")
    public MovieResultsPage discover(int page, String lang) {

        TmdbDiscover discover = api.getDiscover();
        Discover params = new Discover();
        params.page(page);
        params.language(lang);
        params.includeAdult(false);

        return discover.getDiscover(params);
    }

    @Cacheable(value = "movie-db", key = "'getMovie-' + #id + #lang")
    public MovieDb getMovie(int id, String lang) {
        return api.getMovies().getMovie(id, lang, TmdbMovies.MovieMethod.keywords, TmdbMovies.MovieMethod.credits, TmdbMovies.MovieMethod.videos);
    }

    @Cacheable(value = "movie-db", key = "'getTV-' + #id + #lang")
    public TvSeries getTvShow(int id, String lang) {
        return api.getTvSeries().getSeries(id, lang);
    }

    @Cacheable(value = "movie-db", key = "'getSeries-' + #serieId + '-' + #season + #lang")
    public TvSeason getSeriesSeason(int serieId, int season, String lang) {
        return api.getTvSeasons().getSeason(serieId, season, lang);
    }

    @Cacheable("movie-db-configuration")
    public TmdbConfiguration getConfiguration() {
        return api.getConfiguration();
    }
}
