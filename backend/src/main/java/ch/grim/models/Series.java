package ch.grim.models;

import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.services.MovieDBService;
import com.fasterxml.jackson.annotation.JsonProperty;
import info.movito.themoviedbapi.model.tv.TvSeries;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Created by Gaylor on 10.08.2016.
 * Model for the bookmarks of a TV Show
 */
public class Series {

    private TvSeries data;

    private SeriesBookmark bookmark;

    private Map<Integer, Season> seasons = new HashMap<>();

    @JsonProperty("total_episodes_watched")
    private int totalEpisodesWatched;

    public Series(TvSeries series, SeriesBookmark bookmark) {
        this.data = series;
        this.bookmark = bookmark;
    }

    public Series(TvSeries series) {
        this(series, null);
    }

    public Series(TvSeries series, SeriesBookmark bookmark, int total) {
        this(series, bookmark);
        this.totalEpisodesWatched = total;
    }

    /**
     * Populate the hash map of seasons
     */
    public void loadEpisodes(MovieDBService service, int seriesId, String lang) {
        data.getSeasons().forEach(season -> {

            if (season.getSeasonNumber() != 0) {
                Season s = new Season(service.getSeriesSeason(data.getId(), season.getSeasonNumber(), lang), seriesId);
                seasons.put(season.getSeasonNumber(), s);
            }
        });
    }

    /**
     * Populate the episodes with bookmark when existing
     */
    public void loadBookmarks(EpisodeBookmarkRepository repo, Long userId) {
        if (seasons == null) {
            return;
        }

        Collection<EpisodeBookmark> bookmarks = repo.findByAccountIdAndSerieId(userId, data.getId());

        seasons.forEach((index, season) -> {
            season.getEpisodes().forEach(episode -> {
                Optional<EpisodeBookmark> bookmark = bookmarks.stream()
                        .filter(bm -> bm.getEpisodeId() == episode.getId())
                        .findFirst();

                if (bookmark.isPresent()) {
                    episode.setBookmark(bookmark.get());
                }
            });
        });
    }

    public TvSeries getData() {
        return data;
    }

    public SeriesBookmark getBookmark() {
        return bookmark;
    }

    public Map<Integer, Season> getSeasons() {
        return seasons;
    }

    public int getTotalEpisodesWatched() {
        return totalEpisodesWatched;
    }
}
