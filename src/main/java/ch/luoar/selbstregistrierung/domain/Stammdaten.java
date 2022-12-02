package ch.luoar.selbstregistrierung.domain;

import ch.luoar.selbstregistrierung.domain.enumeration.Anrede;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Stammdaten.
 */
@Entity
@Table(name = "stammdaten")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Stammdaten implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "anrede")
    private Anrede anrede;

    @Column(name = "nachname")
    private String nachname;

    @Column(name = "vorname")
    private String vorname;

    @Column(name = "e_mail")
    private String eMail;

    @Column(name = "telefon_mobile")
    private String telefonMobile;

    @JsonIgnoreProperties(value = { "stammdaten", "adresses" }, allowSetters = true)
    @OneToOne(mappedBy = "stammdaten")
    private ZDP zDP;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Stammdaten id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Anrede getAnrede() {
        return this.anrede;
    }

    public Stammdaten anrede(Anrede anrede) {
        this.setAnrede(anrede);
        return this;
    }

    public void setAnrede(Anrede anrede) {
        this.anrede = anrede;
    }

    public String getNachname() {
        return this.nachname;
    }

    public Stammdaten nachname(String nachname) {
        this.setNachname(nachname);
        return this;
    }

    public void setNachname(String nachname) {
        this.nachname = nachname;
    }

    public String getVorname() {
        return this.vorname;
    }

    public Stammdaten vorname(String vorname) {
        this.setVorname(vorname);
        return this;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public String geteMail() {
        return this.eMail;
    }

    public Stammdaten eMail(String eMail) {
        this.seteMail(eMail);
        return this;
    }

    public void seteMail(String eMail) {
        this.eMail = eMail;
    }

    public String getTelefonMobile() {
        return this.telefonMobile;
    }

    public Stammdaten telefonMobile(String telefonMobile) {
        this.setTelefonMobile(telefonMobile);
        return this;
    }

    public void setTelefonMobile(String telefonMobile) {
        this.telefonMobile = telefonMobile;
    }

    public ZDP getZDP() {
        return this.zDP;
    }

    public void setZDP(ZDP zDP) {
        if (this.zDP != null) {
            this.zDP.setStammdaten(null);
        }
        if (zDP != null) {
            zDP.setStammdaten(this);
        }
        this.zDP = zDP;
    }

    public Stammdaten zDP(ZDP zDP) {
        this.setZDP(zDP);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Stammdaten)) {
            return false;
        }
        return id != null && id.equals(((Stammdaten) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Stammdaten{" +
            "id=" + getId() +
            ", anrede='" + getAnrede() + "'" +
            ", nachname='" + getNachname() + "'" +
            ", vorname='" + getVorname() + "'" +
            ", eMail='" + geteMail() + "'" +
            ", telefonMobile='" + getTelefonMobile() + "'" +
            "}";
    }
}
