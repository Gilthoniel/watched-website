package ch.grim;

import ch.grim.models.Account;
import ch.grim.repositories.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class WatchedApplication implements ApplicationListener<ContextRefreshedEvent>, CommandLineRunner {

	private static final Logger LOG = LoggerFactory.getLogger(WatchedApplication.class);

    @Autowired
    private AccountRepository accounts;

	@Value("${spring.profiles.active}")
	protected String springProfilesActive;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		LOG.info("App running with active profiles: {}", springProfilesActive);
	}

    /**
     * Inject CORS header in the HTTP response
     * @return Registration
     */
	@Bean
	public FilterRegistrationBean securityFilterChain() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:8080");
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");
		source.registerCorsConfiguration("/**", config);

		FilterRegistrationBean registration = new FilterRegistrationBean(new CorsFilter(source));
		registration.setOrder(Integer.MIN_VALUE);
		registration.setName("security.filter.cors");
		return registration;
	}

    @Override
    public void run(String... strings) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        accounts.save(new Account("Grim", "gaylor.bosson@gmail.com", encoder.encode("NvidiaGTX970")));
    }

	public static void main(String[] args) {
		SpringApplication.run(WatchedApplication.class, args);
	}
}
