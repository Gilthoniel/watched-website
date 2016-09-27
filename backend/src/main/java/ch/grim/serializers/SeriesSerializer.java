package ch.grim.serializers;

import ch.grim.models.Series;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import info.movito.themoviedbapi.model.tv.TvSeries;

import java.io.IOException;

/**
 * Created by Gaylor on 10.08.2016.
 *
 */
public class SeriesSerializer extends JsonSerializer<Series> {
    @Override
    public void serialize(Series tv, JsonGenerator json, SerializerProvider serializer)
            throws IOException, JsonProcessingException {

        TvSeries series = tv.getData();

        json.writeStartObject();

        json.writeObjectField("bookmark", null);
        json.writeObjectField("seasons", tv.getSeasons());

        json.writeNumberField("id", series.getId());
        json.writeStringField("title", series.getName());
        json.writeStringField("overview", series.getOverview());
        json.writeStringField("release_date", series.getFirstAirDate());
        json.writeStringField("poster", series.getPosterPath());
        json.writeStringField("backdrop", series.getBackdropPath());
        json.writeNumberField("score_average", series.getVoteAverage());
        json.writeNumberField("score_total", series.getVoteCount());

        json.writeEndObject();

    }
}
