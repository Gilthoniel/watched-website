package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

/**
 * Created by gaylo on 8/6/2016.
 *
 */
public class User implements UserDetails {

    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private String hash;

    @JsonIgnore
    private String password;

    public User(Account account) {
        id = account.getId();
        username = account.getUsername();
        email = account.getEmail();
        enabled = account.isEnabled();
        password = account.getPassword();

        try {
            MessageDigest m = MessageDigest.getInstance("MD5");
            m.update(email.getBytes(), 0, email.length());
            hash = new BigInteger(1, m.digest()).toString(16);
        } catch (NoSuchAlgorithmException ignored) {}
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getHash() {
        return hash;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
