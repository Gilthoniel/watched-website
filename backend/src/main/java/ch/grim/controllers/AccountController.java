package ch.grim.controllers;

import ch.grim.controllers.errors.ResetPasswordAlreadyExisting;
import ch.grim.controllers.errors.ResetPasswordExpired;
import ch.grim.mail.MailManager;
import ch.grim.models.Account;
import ch.grim.models.Registration;
import ch.grim.models.ResetPassword;
import ch.grim.models.ResetPasswordConfirmation;
import ch.grim.repositories.AccountRepository;
import ch.grim.repositories.ResetPasswordRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.net.ssl.HttpsURLConnection;
import javax.security.auth.login.AccountNotFoundException;
import javax.servlet.ServletRequest;
import javax.xml.ws.Response;
import java.io.BufferedReader;
import java.io.DataOutput;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;

/**
 * Created by Gaylor on 10/1/2016.
 *
 */
@Controller
@RequestMapping("${spring.data.rest.base-path}/account")
public class AccountController {

    private static final Logger LOG = LoggerFactory.getLogger(AccountController.class);
    private static final String PRIVATE_HASH_SIGN_KEY = "alhdjdafdahfdajvblkdsabvlahbdcldasbdabcldahb";
    private static final int ONE_DAY = 1000*60*60*24;

    private final MailManager mails;

    private final AccountRepository accounts;
    private final ResetPasswordRepository resets;

    @Autowired
    public AccountController(MailManager mails, AccountRepository accounts, ResetPasswordRepository resets) {
        this.mails = mails;
        this.accounts = accounts;
        this.resets = resets;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<String> register(@RequestBody Registration registration) {

        Optional<Account> account = accounts.findByUsername(registration.getEmail());
        if (account.isPresent()) {
            return new ResponseEntity<>("Account already exists", HttpStatus.BAD_REQUEST);
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(registration.getPassword());

        UUID registrationId = UUID.randomUUID();

        Account record = accounts.save(
                new Account(registration.getEmail(), registration.getEmail(), hashedPassword, registrationId.toString())
        );

        // Send a confirmation mail
        Map<String,Object> claims = new HashMap<>();
        claims.put("email", record.getEmail());
        claims.put("uuid", record.getRegisterId());

        Date date = new Date();
        claims.put("expiration", date.getTime() + ONE_DAY); // ms => a day to confirm
        String token = Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, PRIVATE_HASH_SIGN_KEY)
                .compact();

        mails.sendConfirmationMail(record, token);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO : resend confirmation email

    @RequestMapping(value = "/confirm", method = RequestMethod.POST)
    public ResponseEntity<String> confirmAccount(@RequestBody String token) {

        // Try to valid and parse the token
        Claims claims;
        try {
            claims = Jwts.parser()
                    .setSigningKey(PRIVATE_HASH_SIGN_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            return new ResponseEntity<>("Nice try.", HttpStatus.BAD_REQUEST);
        }


        // Check if the link is still valid
        long expiration = (Long) claims.get("expiration");
        Date current = new Date();
        if (expiration < current.getTime()) {
            return new ResponseEntity<>("This link is expired.", HttpStatus.BAD_REQUEST);
        }

        // Confirm the account if existing
        Optional<Account> account = accounts.findByUsername(claims.get("email").toString());
        if (account.isPresent() && account.get().confirm(claims.get("uuid").toString())) {
            accounts.setRegisterId(account.get().getId(), null);
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>("The link is invalid.", HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(value = "/reset", method = RequestMethod.POST)
    public ResponseEntity<String> requestResetPassword(@RequestParam String email) throws Exception {

        // 1. Check if the email is used
        Optional<Account> account = accounts.findByUsername(email);
        if (!account.isPresent()) {
            throw new AccountNotFoundException();
        }

        // 2. Check if there's not already a request to avoid bot spamming
        Optional<ResetPassword> record = resets.findByAccountId(account.get().getId());
        if (record.isPresent()) {
            if (record.get().getExpiration() < System.currentTimeMillis()) {
                // Clean the DB if needed
                resets.delete(record.get());
            } else {
                throw new ResetPasswordAlreadyExisting();
            }
        }

        ResetPassword reset = new ResetPassword(account.get());
        resets.save(reset);

        // 3. Send the email
        mails.sendResetPasswordEmail(account.get(), reset);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/confirm-reset", method = RequestMethod.POST)
    public ResponseEntity<String> confirmResetPassword(
            @RequestBody ResetPasswordConfirmation body) throws Exception {

        Optional<ResetPassword> reset = resets.findByResetId(body.id);
        if (!reset.isPresent()) {
            throw new ResetPasswordExpired();
        }

        if (!reset.get().getResetId().equals(body.id)) {
            throw new IllegalArgumentException();
        }

        Account account = reset.get().getAccount();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(body.password);

        accounts.setPassword(account.getId(), hashedPassword);

        // Allow only one reset
        resets.delete(reset.get());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/captcha", method = RequestMethod.POST)
    public ResponseEntity<String> validateCaptcha(@RequestBody String token) throws Exception {
        URL url = new URL("https://www.google.com/recaptcha/api/siteverify");
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");
        String params = "secret=6LfZJggUAAAAALYoFFN9ubKmGnuH6bqeZtVJYhF1&response=" + token;

        conn.setDoOutput(true);
        DataOutputStream stream = new DataOutputStream(conn.getOutputStream());
        stream.writeBytes(params);
        stream.flush();
        stream.close();

        BufferedReader in = new BufferedReader(
                new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        return new ResponseEntity<>(response.toString(), HttpStatus.OK);
    }
}
