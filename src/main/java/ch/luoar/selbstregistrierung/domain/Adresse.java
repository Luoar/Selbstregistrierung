package ch.luoar.selbstregistrierung.domain;

import ch.luoar.selbstregistrierung.domain.enumeration.Adresstyp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Adresse.
 */
@Entity
@Table(name = "adresse")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Adresse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "strasse_und_nummer")
    private String strasseUndNummer;

    @Column(name = "adresszusatz")
    private String adresszusatz;

    @Column(name = "postfach")
    private String postfach;

    @Column(name = "telefon_fix")
    private String telefonFix;

    @Column(name = "telefon_geschaeft")
    private String telefonGeschaeft;

    @Column(name = "fax")
    private String fax;

    @Enumerated(EnumType.STRING)
    @Column(name = "adresstyp")
    private Adresstyp adresstyp;

    @ManyToOne
    @JsonIgnoreProperties(value = { "stammdaten", "adresses" }, allowSetters = true)
    private ZDP zdp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Adresse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStrasseUndNummer() {
        return this.strasseUndNummer;
    }

    public Adresse strasseUndNummer(String strasseUndNummer) {
        this.setStrasseUndNummer(strasseUndNummer);
        return this;
    }

    public void setStrasseUndNummer(String strasseUndNummer) {
        this.strasseUndNummer = strasseUndNummer;
    }

    public String getAdresszusatz() {
        return this.adresszusatz;
    }

    public Adresse adresszusatz(String adresszusatz) {
        this.setAdresszusatz(adresszusatz);
        return this;
    }

    public void setAdresszusatz(String adresszusatz) {
        this.adresszusatz = adresszusatz;
    }

    public String getPostfach() {
        return this.postfach;
    }

    public Adresse postfach(String postfach) {
        this.setPostfach(postfach);
        return this;
    }

    public void setPostfach(String postfach) {
        this.postfach = postfach;
    }

    public String getTelefonFix() {
        return this.telefonFix;
    }

    public Adresse telefonFix(String telefonFix) {
        this.setTelefonFix(telefonFix);
        return this;
    }

    public void setTelefonFix(String telefonFix) {
        this.telefonFix = telefonFix;
    }

    public String getTelefonGeschaeft() {
        return this.telefonGeschaeft;
    }

    public Adresse telefonGeschaeft(String telefonGeschaeft) {
        this.setTelefonGeschaeft(telefonGeschaeft);
        return this;
    }

    public void setTelefonGeschaeft(String telefonGeschaeft) {
        this.telefonGeschaeft = telefonGeschaeft;
    }

    public String getFax() {
        return this.fax;
    }

    public Adresse fax(String fax) {
        this.setFax(fax);
        return this;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public Adresstyp getAdresstyp() {
        return this.adresstyp;
    }

    public Adresse adresstyp(Adresstyp adresstyp) {
        this.setAdresstyp(adresstyp);
        return this;
    }

    public void setAdresstyp(Adresstyp adresstyp) {
        this.adresstyp = adresstyp;
    }

    public ZDP getZdp() {
        return this.zdp;
    }

    public void setZdp(ZDP zDP) {
        this.zdp = zDP;
    }

    public Adresse zdp(ZDP zDP) {
        this.setZdp(zDP);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Adresse)) {
            return false;
        }
        return id != null && id.equals(((Adresse) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Adresse{" +
            "id=" + getId() +
            ", strasseUndNummer='" + getStrasseUndNummer() + "'" +
            ", adresszusatz='" + getAdresszusatz() + "'" +
            ", postfach='" + getPostfach() + "'" +
            ", telefonFix='" + getTelefonFix() + "'" +
            ", telefonGeschaeft='" + getTelefonGeschaeft() + "'" +
            ", fax='" + getFax() + "'" +
            ", adresstyp='" + getAdresstyp() + "'" +
            "}";
    }
}
