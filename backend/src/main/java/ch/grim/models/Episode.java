package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import info.movito.themoviedbapi.model.tv.TvEpisode;

/**
 * Created by Gaylor on 28.09.2016.
 * Episode of a season of a TV Show
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Episode {

    private int id;
    private String name;
    private String overview;
    @JsonProperty(value = "series_id")
    private int seriesId;
    @JsonProperty(value = "episode_number")
    private int episodeNumber;
    @JsonProperty(value = "season_number")
    private int seasonNumber;
    @JsonProperty(value = "air_date")
    private String airDate;
    @JsonProperty(value = "still_path")
    private String stillPath;

    private EpisodeBookmark bookmark;

    Episode() {}

    public Episode(TvEpisode episode, int seriesId) {
        id = episode.getId();
        name = episode.getName();
        overview = episode.getOverview();
        this.seriesId = seriesId;
        episodeNumber = episode.getEpisodeNumber();
        seasonNumber = episode.getSeasonNumber();
        airDate = episode.getAirDate();
        stillPath = episode.getStillPath();
    }

    public Episode(TvEpisode episode, int seriesId, EpisodeBookmark bm) {
        this(episode, seriesId);
        bookmark = bm;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getOverview() {
        return overview;
    }

    public int getSeriesId() {
        return seriesId;
    }

    public int getEpisodeNumber() {
        return episodeNumber;
    }

    public int getSeasonNumber() {
        return seasonNumber;
    }

    public String getAirDate() {
        return airDate;
    }

    public String getStillPath() {
        return stillPath;
    }

    public EpisodeBookmark getBookmark() {
        return bookmark;
    }

    public void setBookmark(EpisodeBookmark bookmark) {
        this.bookmark = bookmark;
    }
}
