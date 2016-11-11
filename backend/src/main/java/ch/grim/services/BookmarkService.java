package ch.grim.services;

import ch.grim.models.*;
import ch.grim.repositories.EpisodeBookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.ServletRequest;
import java.io.IOException;
import java.util.Collection;

/**
 * Created by Gaylor on 11.11.2016.
 * Service to manage with bookmarks
 */
@Service
public class BookmarkService {

    private MovieDBService service;

    private EpisodeBookmarkRepository repository;

    @Autowired
    BookmarkService(MovieDBService service, EpisodeBookmarkRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @Async
    public void loadBookmarks(SseEmitter emitter,
                              Collection<MovieBookmark> movieBm,
                              Collection<SeriesBookmark> seriesBm,
                              User user,
                              ServletRequest request) {

        try {
            movieBm.forEach(bm -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name("movie")
                            .data(new Movie(service.getMovie(bm.getMovieId(), request.getLocale().getLanguage()), bm))
                    );
                } catch (IOException ignored) {}
            });

            seriesBm.forEach(bm -> {
                int total = repository.findByAccountIdAndSerieId(user.getId(), bm.getSeriesId()).size();

                try {
                    emitter.send(SseEmitter.event()
                            .name("series")
                            .data(new Series(service.getTvShow(bm.getSeriesId(), request.getLocale().getLanguage()), bm, total))
                    );
                } catch (IOException ignored) {}
            });

            emitter.send(SseEmitter.event().name("EOS").data("End of Stream"));

        } catch (IOException ignored) {

        } finally {
            emitter.complete();
        }
    }
}
