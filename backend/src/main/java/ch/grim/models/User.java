package ch.grim.models;

import com.stormpath.sdk.account.Account;
import com.stormpath.sdk.directory.CustomData;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Created by Gaylor on 31.07.2016.
 * User model for the web app
 */
public class User {

    private String id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String hash;

    private User() {}

    public User(Account account) {
        id = account.getHref().substring(account.getHref().lastIndexOf("/") + 1);
        firstName = account.getGivenName();
        lastName = account.getSurname();
        fullName = account.getFullName();
        email = account.getEmail();

        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            digest.update(email.getBytes());
            byte[] byteData = digest.digest();

            StringBuilder sb = new StringBuilder();
            for (byte aByteData : byteData) {
                sb.append(Integer.toString((aByteData & 0xff) + 0x100, 16).substring(1));
            }

            hash = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            hash = "";
        }
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getHash() {
        return hash;
    }
}
