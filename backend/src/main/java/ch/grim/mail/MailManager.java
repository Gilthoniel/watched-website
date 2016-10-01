package ch.grim.mail;

import ch.grim.models.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Created by Gaylor on 10/1/2016.
 * Send email to a client
 */
@Service
public class MailManager {

    private final JavaMailSender sender;

    @Autowired
    public MailManager(JavaMailSender sender) {
        this.sender = sender;
    }

    public void sendConfirmationMail(Account account, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(account.getEmail());
        msg.setFrom("registration@grimsoft.ch");
        msg.setSubject("Your registration to grimsoft.ch");
        msg.setText("Please confirm your email with the following link. <br><br> " +
                "https://grimsoft.ch/confirm-account?token="+token);

        sender.send(msg);
    }
}
