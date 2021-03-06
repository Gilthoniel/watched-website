package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import info.movito.themoviedbapi.model.tv.TvSeason;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * Created by Gaylor on 28.09.2016.
 * Season of a TV Show
 */
public class Season {

    private int id;

    @JsonProperty(value = "season_number")
    private int seasonNumber;

    @JsonProperty(value = "series_id")
    private int seriesId;

    private Collection<Episode> episodes;

    public Season(TvSeason season, int seriesId) {
        id = season.getId();
        this.seriesId = seriesId;
        seasonNumber = season.getSeasonNumber();
        episodes = season.getEpisodes().stream()
                .map(episode -> new Episode(episode, seriesId))
                .collect(Collectors.toList());
    }

    public int getId() {
        return id;
    }

    public int getSeriesId() {
        return seriesId;
    }

    public int getSeasonNumber() {
        return seasonNumber;
    }

    public Collection<Episode> getEpisodes() {
        return episodes;
    }
}
