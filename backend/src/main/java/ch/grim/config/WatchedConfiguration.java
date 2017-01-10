package ch.grim.config;

import ch.grim.models.Movie;
import ch.grim.models.Series;
import ch.grim.serializers.MovieSerializer;
import ch.grim.serializers.SeriesSerializer;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.aop.interceptor.SimpleAsyncUncaughtExceptionHandler;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.lang.reflect.Method;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by Gaylor on 31.07.2016.
 * Web MVC configuration
 */
@Configuration
@EnableCaching
@EnableAsync
public class WatchedConfiguration extends WebMvcConfigurerAdapter implements AsyncConfigurer {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        SimpleModule m = new SimpleModule();

        m.addSerializer(Movie.class, new MovieSerializer());
        m.addSerializer(Series.class, new SeriesSerializer());

        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder().modules(m);
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
    }

    @Bean
    @Primary
    public ObjectMapper jsonObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        SimpleModule m = new SimpleModule();
        m.addSerializer(Movie.class, new MovieSerializer());
        m.addSerializer(Series.class, new SeriesSerializer());
        mapper.registerModule(m);

        return mapper;
    }

    @Bean
    public EhCacheCacheManager cacheManager() {
        return new EhCacheCacheManager();
    }

    @Bean
    public ExecutorService executorService() {
        return Executors.newFixedThreadPool(50);
    }

    @Override
    public AsyncTaskExecutor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.initialize();

        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new SimpleAsyncUncaughtExceptionHandler() {
            @Override
            public void handleUncaughtException(Throwable ex, Method method, Object... params) {
                System.out.println("Method Name::"+method.getName());
                System.out.println("Exception occurred::"+ ex);
            }
        };
    }
}
