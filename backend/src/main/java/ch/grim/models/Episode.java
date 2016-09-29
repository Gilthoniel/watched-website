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
    @JsonProperty(value = "episode_number")
    private int episodeNumber;

    private EpisodeBookmark bookmark;

    public Episode(TvEpisode episode) {
        id = episode.getId();
        name = episode.getName();
        overview = episode.getOverview();
        episodeNumber = episode.getEpisodeNumber();
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getEpisodeNumber() {
        return episodeNumber;
    }

    public EpisodeBookmark getBookmark() {
        return bookmark;
    }

    public void setBookmark(EpisodeBookmark bookmark) {
        this.bookmark = bookmark;
    }
}
