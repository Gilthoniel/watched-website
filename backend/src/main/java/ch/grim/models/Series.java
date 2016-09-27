package ch.grim.models;

import ch.grim.services.MovieDBService;
import com.sun.istack.internal.Nullable;
import info.movito.themoviedbapi.model.tv.TvSeason;
import info.movito.themoviedbapi.model.tv.TvSeries;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Gaylor on 10.08.2016.
 * Model for the bookmarks of a TV Show
 */
public class Series {

    private TvSeries data;

    private SeriesBookmark bookmark;

    private Map<Integer, TvSeason> seasons = new HashMap<>();

    public Series(TvSeries series, @Nullable SeriesBookmark bookmark) {
        this.data = series;
        this.bookmark = bookmark;
    }

    public Series(TvSeries series) {
        this(series, null);
    }

    /**
     * Populate the hashmap of seasons
     */
    public void loadEpisodes(MovieDBService service, String lang) {
        data.getSeasons().forEach(season -> {
            seasons.put(season.getSeasonNumber(), service.getSeriesSeason(data.getId(), season.getSeasonNumber(), lang));
        });
    }

    public TvSeries getData() {
        return data;
    }

    public SeriesBookmark getBookmark() {
        return bookmark;
    }

    public Map<Integer, TvSeason> getSeasons() {
        return seasons;
    }
}
