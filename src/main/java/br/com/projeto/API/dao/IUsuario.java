package br.com.projeto.API.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import br.com.projeto.API.model.Usuario;

public interface IUsuario extends CrudRepository<Usuario, Integer>{

    List<Usuario> findAllByOrderByNomeAsc();
    List<Usuario> findAllByOrderByNomeDesc();
    List<Usuario> findByNomeContainingIgnoreCase(String nome); // Busca usuários pelo nome (case insensitive)

}