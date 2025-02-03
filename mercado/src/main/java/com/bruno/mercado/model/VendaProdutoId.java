package com.bruno.mercado.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaProdutoId implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long idProduto;
    private Long idVenda;
}
