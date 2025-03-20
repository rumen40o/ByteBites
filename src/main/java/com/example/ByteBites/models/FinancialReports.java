package com.example.ByteBites.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "financial_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FinancialReports {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType reportType;

    @ManyToOne
    @JoinColumn(name = "deliver_id", nullable = true)
    private Accounts deliver;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String reportDate;
}
