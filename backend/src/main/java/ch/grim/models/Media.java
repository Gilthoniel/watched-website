package ch.grim.models;

import info.movito.themoviedbapi.model.Multi;

/**
 * Created by Gaylor on 28.10.2016.
 * Movie or Series
 */
interface Media {

    /**
     * Used to determine type Multi object without {@code instanceof()} or {@code getClass}
     */
    public Multi.MediaType getMediaType();

}
