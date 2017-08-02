package ch.grim.services;

import ch.grim.models.*;
import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.repositories.MovieBookmarkRepository;
import ch.grim.repositories.SeriesBookmarkRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.tv.TvSeries;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

/**
 * Created by Gaylor on 11.11.2016.
 * Service to manage with bookmarks
 */
@Service
public class BookmarkService {

    private static final Logger LOG = LoggerFactory.getLogger(BookmarkService.class);

    private ObjectMapper mapper;

    private MovieDBService service;
    private ExecutorService executor;

    private EpisodeBookmarkRepository repository;
    private MovieBookmarkRepository movieRepo;
    private SeriesBookmarkRepository seriesRepo;

    @Autowired
    BookmarkService(MovieDBService service, EpisodeBookmarkRepository repository, ExecutorService executor,
                    MovieBookmarkRepository repo2, SeriesBookmarkRepository repo3,
                    @Qualifier("jsonObjectMapper") ObjectMapper mapper) {
        this.service = service;
        this.repository = repository;
        this.movieRepo = repo2;
        this.seriesRepo = repo3;
        this.executor = executor;
        this.mapper = mapper;
    }

    /**
     * Send list details over websocket
     *
     * @param session WebSocket session
     * @param user    current user
     * @param lang    language
     */
    @Async
    public void loadBookmarks(WebSocketSession session, User user, String lang) {

        // Get the movies
        Collection<MovieBookmark> movieBm = movieRepo.findByAccountId(user.getId());
        // Get the Series
        Collection<SeriesBookmark> seriesBm = seriesRepo.findByAccountId(user.getId());

        // Send the total number of bookmarks
        int totalBm = movieBm.size() + seriesBm.size();
        new EventMessage<>("TOTAL", totalBm).send(session);

        List<Future<?>> futures = new LinkedList<>();
        for (MovieBookmark bm : movieBm) {
            futures.add(executor.submit(() -> {
                // Get if available or launch a api request
                MovieDb record = service.getMovie(bm.getMovieId(), lang);

                synchronized (session) {
                    new EventMessage<>("MOVIE", new Movie(record, bm)).send(session);
                }
            }));
        }

        for (SeriesBookmark bm : seriesBm) {
            int total = repository.findByAccountIdAndSerieId(user.getId(), bm.getSeriesId()).size();

            futures.add(executor.submit(() -> {
                TvSeries series = service.getTvShow(bm.getSeriesId(), lang);

                synchronized (session) {
                    new EventMessage<>("SERIES", new Series(series, bm, total)).send(session);
                }
            }));
        }

        for (Future<?> future : futures) {
            try {
                future.get();
            } catch (InterruptedException | ExecutionException e) {
                LOG.error("BookmarkService | Future", e.getMessage());
            }
        }

        try {
            session.close();
        } catch (IOException ignored) {}
    }

    /**
     * Object to parse to JSON to send over web socket
     *
     * @param <T>
     */
    private class EventMessage<T> {

        @JsonProperty
        String event;
        @JsonProperty
        T payload;

        EventMessage(String event, T payload) {
            this.event = event;
            this.payload = payload;
        }

        void send(WebSocketSession session) {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(this)));
            } catch (IOException e) {
                LOG.error(e.getMessage());
            }
        }
    }
}
