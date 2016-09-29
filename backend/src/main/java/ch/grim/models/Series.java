package ch.grim.models;

import ch.grim.repositories.EpisodeBookmarkRepository;
import ch.grim.services.MovieDBService;
import info.movito.themoviedbapi.model.tv.TvSeries;

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

    public Series(TvSeries series, SeriesBookmark bookmark) {
        this.data = series;
        this.bookmark = bookmark;
    }

    public Series(TvSeries series) {
        this(series, null);
    }

    /**
     * Populate the hash map of seasons
     */
    public void loadEpisodes(MovieDBService service, String lang) {
        data.getSeasons().forEach(season -> {
            Season s = new Season(service.getSeriesSeason(data.getId(), season.getSeasonNumber(), lang));
            seasons.put(season.getSeasonNumber(), s);
        });
    }

    /**
     * Populate the episodes with bookmark when existing
     */
    public void loadBookmarks(EpisodeBookmarkRepository repo, Long userId) {
        if (seasons == null) {
            return;
        }

        seasons.forEach((index, season) -> {
            season.getEpisodes().forEach(episode -> {
                Optional<EpisodeBookmark> bookmark = repo.findByAccountIdAndSerieIdAndEpisodeId(userId, season.getId(), episode.getId());

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
}
