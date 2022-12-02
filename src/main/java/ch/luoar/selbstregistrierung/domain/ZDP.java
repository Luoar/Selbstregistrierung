package ch.luoar.selbstregistrierung.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ZDP.
 */
@Entity
@Table(name = "zdp")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ZDP implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "zdp_nummer")
    private Integer zdpNummer;

    @JsonIgnoreProperties(value = { "zDP" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Stammdaten stammdaten;

    @OneToMany(mappedBy = "zdp")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "zdp" }, allowSetters = true)
    private Set<Adresse> adresses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ZDP id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getZdpNummer() {
        return this.zdpNummer;
    }

    public ZDP zdpNummer(Integer zdpNummer) {
        this.setZdpNummer(zdpNummer);
        return this;
    }

    public void setZdpNummer(Integer zdpNummer) {
        this.zdpNummer = zdpNummer;
    }

    public Stammdaten getStammdaten() {
        return this.stammdaten;
    }

    public void setStammdaten(Stammdaten stammdaten) {
        this.stammdaten = stammdaten;
    }

    public ZDP stammdaten(Stammdaten stammdaten) {
        this.setStammdaten(stammdaten);
        return this;
    }

    public Set<Adresse> getAdresses() {
        return this.adresses;
    }

    public void setAdresses(Set<Adresse> adresses) {
        if (this.adresses != null) {
            this.adresses.forEach(i -> i.setZdp(null));
        }
        if (adresses != null) {
            adresses.forEach(i -> i.setZdp(this));
        }
        this.adresses = adresses;
    }

    public ZDP adresses(Set<Adresse> adresses) {
        this.setAdresses(adresses);
        return this;
    }

    public ZDP addAdresse(Adresse adresse) {
        this.adresses.add(adresse);
        adresse.setZdp(this);
        return this;
    }

    public ZDP removeAdresse(Adresse adresse) {
        this.adresses.remove(adresse);
        adresse.setZdp(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ZDP)) {
            return false;
        }
        return id != null && id.equals(((ZDP) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ZDP{" +
            "id=" + getId() +
            ", zdpNummer=" + getZdpNummer() +
            "}";
    }
}
