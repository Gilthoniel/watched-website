package ch.grim.config;

import ch.grim.models.Movie;
import ch.grim.models.Series;
import ch.grim.serializers.MovieSerializer;
import ch.grim.serializers.SeriesSerializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

/**
 * Created by Gaylor on 31.07.2016.
 * Web MVC configuration
 */
@Configuration
@EnableCaching
public class WatchedConfiguration extends WebMvcConfigurerAdapter {
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        SimpleModule m = new SimpleModule();

        m.addSerializer(Movie.class, new MovieSerializer());
        m.addSerializer(Series.class, new SeriesSerializer());

        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder().modules(m);
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
    }
}
