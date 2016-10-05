package ch.grim.config;

import ch.grim.models.Movie;
import ch.grim.models.Series;
import ch.grim.serializers.MovieSerializer;
import ch.grim.serializers.SeriesSerializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.google.common.cache.CacheBuilder;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.cache.interceptor.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Created by Gaylor on 31.07.2016.
 * Web MVC configuration
 */
@Configuration
@EnableCaching
public class WatchedConfiguration extends WebMvcConfigurerAdapter implements CachingConfigurer {

    private static final int MAX_NUMBER_ENTRIES = 1000000;

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        SimpleModule m = new SimpleModule();

        m.addSerializer(Movie.class, new MovieSerializer());
        m.addSerializer(Series.class, new SeriesSerializer());

        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder().modules(m);
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
    }

    @Override
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager() {
            @Override
            protected Cache createConcurrentMapCache(final String name) {
                return new ConcurrentMapCache(name,
                        CacheBuilder.newBuilder()
                                .expireAfterWrite(24, TimeUnit.HOURS)
                                .maximumSize(MAX_NUMBER_ENTRIES)
                                .build().asMap(), false);
            }
        };
    }

    @Override
    public CacheResolver cacheResolver() {
        return new SimpleCacheResolver();
    }

    @Override
    public KeyGenerator keyGenerator() {
        return new SimpleKeyGenerator();
    }

    @Override
    public CacheErrorHandler errorHandler() {
        return new SimpleCacheErrorHandler();
    }
}
