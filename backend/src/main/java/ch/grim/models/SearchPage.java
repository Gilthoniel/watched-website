package ch.grim.models;

import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.TmdbSearch;
import info.movito.themoviedbapi.TmdbTV;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.Multi;
import info.movito.themoviedbapi.model.tv.TvSeries;

import java.util.Collection;
import java.util.LinkedList;
import java.util.Optional;

/**
 * Created by Gaylor on 28.10.2016.
 *
 */
public class SearchPage {

    private Collection<Media> medias;
    private Collection<Series> series;

    public SearchPage(TmdbSearch.MultiListResultsPage results, Collection<MovieBookmark> moviesBm, Collection<SeriesBookmark> seriesBm) {
        medias = new LinkedList<>();
        series = new LinkedList<>();

        results.getResults().forEach((result) -> {
            if (result.getMediaType() == Multi.MediaType.MOVIE) {
                MovieDb movie = (MovieDb) result;

                Optional<MovieBookmark> bookmark = moviesBm
                        .stream()
                        .filter(bm -> bm.getMovieId() == movie.getId())
                        .findFirst();

                if (bookmark.isPresent()) {
                    medias.add(new Movie(movie, bookmark.get()));
                } else {
                    medias.add(new Movie(movie));
                }

            } else if (result.getMediaType() == Multi.MediaType.TV_SERIES) {

                TvSeries tvSeries = (TvSeries) result;
                Optional<SeriesBookmark> bm = seriesBm.stream().filter(b -> b.getSeriesId() == tvSeries.getId()).findFirst();

                if (bm.isPresent()) {
                    Series m = new Series(tvSeries, bm.get());
                    medias.add(m);
                    series.add(m); // List of series that must be filled with number of episodes
                } else {
                    medias.add(new Series(tvSeries));
                }
            }
        });
    }

    public void fillNumberWatchedEpisodes(MovieDBService service, EpisodeBookmarkRepository repo, long userId, String lang) {
        series.forEach(media -> {
            // Limit to only pinned series
            if (media.getBookmark() != null) {
                int total = repo.findByAccountIdAndSerieId(userId, media.getData().getId()).size();
                media.setTotalEpisodesWatched(total);

                // Get more details about the series
                TvSeries more = service.getTvShow(media.getData().getId(), lang, TmdbTV.TvMethod.credits);
                media.setData(more);
            }
        });
    }

    public Collection<Media> getMedias() {
        return medias;
    }
}
