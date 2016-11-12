package ch.grim.services;

import ch.grim.models.*;
import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.repositories.SeriesBookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.ServletRequest;
import java.io.IOException;
import java.util.Collection;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Created by Gaylor on 11.11.2016.
 * Service to manage with bookmarks
 */
@Service
public class BookmarkService {

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
     *
     * Events:
     *   RESET: because we re-send again all the data, the client has to clean the arrays
     *   EOS: End of Stream, the client can close the EventSource
     *   movie: the data is a movie
     *   series: the data is a series
     *
     * @param emitter Server sent events emitter
     * @param user current user
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

            Collection<Future<Movie>> fMovies = executor.invokeAll(movieBm.stream()
                            .map(bm -> (Callable<Movie>) () -> new Movie(service.getMovie(bm.getMovieId(), request.getLocale().getLanguage()), bm))
                            .collect(Collectors.toList()),
                    1, TimeUnit.SECONDS);

            for (Future<Movie> future : fMovies) {
                try {
                    future.get(); // Wait for completion or timeout

                    if (future.isDone()) {
                        emitter.send(SseEmitter.event().name("movie").data(future.get()));
                    }
                } catch (InterruptedException | CancellationException e) {
                    isNotComplete = true;
                }
            }

            Collection<Future<Series>> fSeries = executor.invokeAll(seriesBm.stream()
                    .map(bm -> (Callable<Series>) () -> {
                        int total = repository.findByAccountIdAndSerieId(user.getId(), bm.getSeriesId()).size();

                        return new Series(service.getTvShow(bm.getSeriesId(), request.getLocale().getLanguage()), bm, total);
                    })
                    .collect(Collectors.toList()), 1, TimeUnit.SECONDS);

            for (Future<Series> future : fSeries) {
                try {
                    future.get(); // Wait for completion or timeout

                    if (future.isDone()) {
                        emitter.send(SseEmitter.event().name("series").data(future.get()));
                    }
                } catch (InterruptedException | CancellationException e) {
                    isNotComplete = true;
                }
            }

            if (isNotComplete) {
                emitter.send(SseEmitter.event().reconnectTime(5000).data("Reconnect Time Configuration"));
            } else {
                emitter.send(SseEmitter.event().name("EOS").data("End of Stream"));
            }

            emitter.complete();

        } catch (IOException | InterruptedException e) {
            emitter.completeWithError(e);
        } catch (Exception ignored) {}

    }

}
