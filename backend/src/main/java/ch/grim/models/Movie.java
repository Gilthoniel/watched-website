package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.Multi;

/**
 * Created by Gaylor on 8/7/2016.
 * Cannot extend the MovieDb class because we cannot set the fields
 * due to lack of constructor...
 */
public class Movie implements Media {

    @JsonProperty("media_type")
    private Multi.MediaType mediaType = Multi.MediaType.MOVIE;

    private MovieBookmark bookmark;

    private MovieDb data;

    public Movie(MovieDb movie, MovieBookmark bookmark) {
        data = movie;
        this.bookmark = bookmark;
    }

    public Movie(MovieDb movie) {
        data = movie;
    }

    public MovieDb getData() {
        return data;
    }

    public MovieBookmark getBookmark() {
        return bookmark;
    }

    public Multi.MediaType getMediaType() {
        return mediaType;
    }
}
