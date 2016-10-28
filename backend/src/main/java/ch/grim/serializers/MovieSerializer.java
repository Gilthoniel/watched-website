package ch.grim.serializers;

import ch.grim.models.Movie;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import info.movito.themoviedbapi.model.MovieDb;

import java.io.IOException;

/**
 * Created by gaylo on 8/7/2016.
 * Convert a MovieDb object from the API into a correct json
 */
public class MovieSerializer extends JsonSerializer<Movie> {
    @Override
    public void serialize(Movie m, JsonGenerator json, SerializerProvider serializer)
            throws IOException {
        MovieDb movie = m.getData();

        json.writeStartObject();

        json.writeObjectField("bookmark", m.getBookmark());
        json.writeStringField("media_type", m.getMediaType().name());

        json.writeNumberField("id", movie.getId());
        json.writeStringField("title", movie.getTitle());
        json.writeStringField("overview", movie.getOverview());
        json.writeStringField("release_date", movie.getReleaseDate());
        json.writeStringField("poster", movie.getPosterPath());
        json.writeStringField("backdrop", movie.getBackdropPath());
        json.writeNumberField("score_average", movie.getVoteAverage());
        json.writeNumberField("score_total", movie.getVoteCount());

        if (movie.getKeywords() != null) {
            json.writeArrayFieldStart("keywords");
            movie.getKeywords().forEach(keyword -> {
                try {
                    json.writeString(keyword.getName());
                } catch (IOException ignored) {}
            });
            json.writeEndArray();
        }

        if (movie.getGenres() != null) {
            json.writeArrayFieldStart("genres");
            movie.getGenres().forEach(genre -> {
                try {
                    json.writeString(genre.getName());
                } catch (IOException ignored) {}
            });
            json.writeEndArray();
        }

        json.writeEndObject();
    }
}
