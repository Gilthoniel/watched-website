package ch.grim.services;

import info.movito.themoviedbapi.*;
import info.movito.themoviedbapi.model.Discover;
import info.movito.themoviedbapi.model.FindResults;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.config.TmdbConfiguration;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.tv.TvSeason;
import info.movito.themoviedbapi.model.tv.TvSeries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;

/**
 * Created by Gaylor on 31.07.2016.
 * Service to request information from TheMovieDB
 */
@Service
public class MovieDBService {

    private static final TmdbApi api = new TmdbApi("206f79eda0e7499536358bbfd3e47743");

    private Cache cache;
    private ExecutorService executor;

    private ConcurrentMap<String, Future<?>> requests = new ConcurrentHashMap<>();

    @Autowired
    MovieDBService(EhCacheCacheManager cache, ExecutorService executor) {
        this.cache = cache.getCache("movie-db");
        this.executor = executor;
    }

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
        return api.getMovies().getMovie(id, lang,
                TmdbMovies.MovieMethod.keywords, TmdbMovies.MovieMethod.credits, TmdbMovies.MovieMethod.videos);
    }

    MovieDb getMovieOrNull(int id, String lang) {
        final String key = "getMovieOrNull-" + id + lang;

        Cache.ValueWrapper object = cache.get(key);
        if (object == null) {
            cache.put(key, null); // Set the cache entry to execute only one request for the movie
            executor.submit(() -> {
                MovieDb movie = api.getMovies().getMovie(id, lang,
                        TmdbMovies.MovieMethod.keywords, TmdbMovies.MovieMethod.credits, TmdbMovies.MovieMethod.videos);
                cache.put(key, movie);
            });

            return null;
        } else {
            return (MovieDb) object.get();
        }
    }

    @Cacheable(value = "movie-db", key = "'getTV-' + #id + #lang")
    public TvSeries getTvShow(int id, String lang) {
        return api.getTvSeries().getSeries(id, lang, TmdbTV.TvMethod.credits);
    }

    TvSeries getTvShowOrNull(int id, String lang) {
        final String key = "getTVOrNull-" + id + lang;

        Cache.ValueWrapper object = cache.get(key);
        if (object == null) {
            cache.put(key, null);
            executor.submit(() -> {
                TvSeries series = api.getTvSeries().getSeries(id, lang, TmdbTV.TvMethod.credits);
                cache.put(key, series);
            });

            return null;
        } else {
            return (TvSeries) object.get();
        }
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
