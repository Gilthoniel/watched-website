package ch.grim.services;

import ch.grim.models.*;
import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.repositories.SeriesBookmarkRepository;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.tv.TvSeries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.ServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Created by Gaylor on 11.11.2016.
 * Service to manage with bookmarks
 */
@Service
public class BookmarkService {

    private static final int MAX_LOADING_IN_SECONDS = 1;
    private static final int RECONNECT_TIME_IN_MILLIS = 1000;

    private MovieDBService service;
    private ExecutorService executor;

    private EpisodeBookmarkRepository repository;
    private MovieBookmarkRepository movieRepo;
    private SeriesBookmarkRepository seriesRepo;

    @Autowired
    BookmarkService(MovieDBService service, EpisodeBookmarkRepository repository, ExecutorService executor,
                    MovieBookmarkRepository repo2, SeriesBookmarkRepository repo3) {
        this.service = service;
        this.repository = repository;
        this.movieRepo = repo2;
        this.seriesRepo = repo3;
        this.executor = executor;
    }

    /**
     * Send to the client the bookmarks that are accessible in less than one second
     * <p>
     * Events:
     * RESET: because we re-send again all the data, the client has to clean the arrays
     * EOS: End of Stream, the client can close the EventSource
     * movie: the data is a movie
     * series: the data is a series
     *
     * @param emitter Server sent events emitter
     * @param user    current user
     * @param request current request
     */
    @Async
    public void loadBookmarks(SseEmitter emitter, User user, ServletRequest request) {

        // Get the movies
        Collection<MovieBookmark> movieBm = movieRepo.findByAccountId(user.getId());
        // Get the Series
        Collection<SeriesBookmark> seriesBm = seriesRepo.findByAccountId(user.getId());

        boolean isNotComplete = false;

        try {
            emitter.send(SseEmitter.event().name("RESET").data("Start a new stream"));

            // Send the total number of bookmarks
            int totalBm = movieBm.size() + seriesBm.size();
            emitter.send(SseEmitter.event().name("total").data(totalBm));

            for (MovieBookmark bm : movieBm) {
                // Get if available or launch a api request
                MovieDb record = service.getMovieOrNull(bm.getMovieId(), request.getLocale().getLanguage());
                if (record != null) {
                    try {
                        emitter.send(SseEmitter.event().name("movie").data(new Movie(record, bm)));
                    } catch (IOException ignored) {}
                } else {
                    isNotComplete = true;
                }
            }

            for (SeriesBookmark bm : seriesBm) {
                TvSeries series = service.getTvShowOrNull(bm.getSeriesId(), request.getLocale().getLanguage());
                if (series != null) {
                    try {
                        int total = repository.findByAccountIdAndSerieId(user.getId(), bm.getSeriesId()).size();

                        emitter.send(SseEmitter.event().name("series").data(new Series(series, bm, total)));
                    } catch (IOException ignored) {}
                }
            }

            if (isNotComplete) {
                emitter.send(SseEmitter.event().reconnectTime(RECONNECT_TIME_IN_MILLIS).data("Reconnect Time Configuration"));
            } else {
                emitter.send(SseEmitter.event().name("EOS").data("End of Stream"));
            }

            emitter.complete();

        } catch (IOException e) {
            emitter.completeWithError(e);
        } catch (Exception ignored) {}
    }
}
