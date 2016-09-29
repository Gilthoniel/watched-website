package ch.grim.models;

import info.movito.themoviedbapi.model.MovieDb;

/**
 * Created by Gaylor on 8/7/2016.
 * Cannot extend the MovieDb class because we cannot set the fields
 * due to lack of constructor...
 */
public class Movie {

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
}
