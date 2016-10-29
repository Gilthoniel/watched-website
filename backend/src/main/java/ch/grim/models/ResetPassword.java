package ch.grim.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.UUID;

/**
 * Created by gaylo on 10/29/2016.
 * Tuple of Account ID - Reset ID - Expiration to let users reset their passwords
 */
@Entity
public class ResetPassword {

    @Id
    @GeneratedValue
    private long id;

    @JsonIgnore
    @ManyToOne
    private Account account;
    private String resetId;
    private long expiration;

    ResetPassword() {}

    public ResetPassword(Account account) {
        this.account = account;
        resetId = UUID.randomUUID().toString();
        expiration = System.currentTimeMillis() + 1000 * 60 * 60 * 6; // 6 hours
    }

    public long getId() {
        return id;
    }

    public long getExpiration() {
        return expiration;
    }

    public Account getAccount() {
        return account;
    }

    public String getResetId() {
        return resetId;
    }
}
