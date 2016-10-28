package ch.grim.models;

import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.TvResultsPage;
import info.movito.themoviedbapi.model.tv.TvSeries;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

/**
 * Created by Gaylor on 10.08.2016.
 *
 */
public class SeriesSearchResults {

    private int page;
    private int totalPage;
    private List<Series> results;

    public SeriesSearchResults(TvResultsPage results, Collection<SeriesBookmark> bookmarks) {
        page = results.getPage();
        totalPage = results.getTotalPages();

        this.results = new LinkedList<>();
        results.forEach(tvSeries -> {

            Optional<SeriesBookmark> bm = bookmarks.stream().filter(b -> b.getSeriesId() == tvSeries.getId()).findFirst();

            if (bm.isPresent()) {
                this.results.add(new Series(tvSeries, bm.get()));
            } else {
                this.results.add(new Series(tvSeries));
            }
        });
    }

    public void fillNumberWatchedEpisodes(MovieDBService service, EpisodeBookmarkRepository repo, long userId, String lang) {
        results.forEach(series -> {
            if (series.getBookmark() != null) {
                int total = repo.findByAccountIdAndSerieId(userId, series.getData().getId()).size();
                series.setTotalEpisodesWatched(total);

                // Get more details about the series
                TvSeries more = service.getTvShow(series.getData().getId(), lang);
                series.setData(more);
            }
        });
    }

    public int getPage() {
        return page;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public List<Series> getResults() {
        return results;
    }
}
