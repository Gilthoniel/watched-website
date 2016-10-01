package ch.grim.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

/**
 * Created by gaylor on 8/6/2016.
 * Controller authorizations
 */
@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/h2-console", "/h2-console/**").permitAll()
                .antMatchers("/api/account/**").permitAll()
                .and()
                .authorizeRequests()
                .antMatchers("/api/media/**").access("isAnonymous() or isAuthenticated()")
                .and()
                .authorizeRequests()
                .antMatchers("/**").authenticated()
                .and()
                .headers().frameOptions().sameOrigin();
    }
}
