package br.com.projeto.API.controle;
import java.util.List;	
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.projeto.API.dao.IUsuario;
import br.com.projeto.API.model.Usuario;
@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class Controle {
	@Autowired				
	private IUsuario dao;

	@PostMapping
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		Usuario usuarioNovo = dao.save(usuario);
		return usuarioNovo;

	}

	@PutMapping

	public Usuario editarUsuario(@RequestBody Usuario usuario) {
	    if (usuario.getId() != null && dao.existsById(usuario.getId())) {
	        return dao.save(usuario); // Atualiza o usuário existente
	    } else {
	        throw new RuntimeException("Usuário não encontrado para atualização."); // Lança erro se o ID não existir
	    }
	}

	@DeleteMapping("/{id}")

	public Optional<Usuario> deleteUsuario(@PathVariable Integer id) {
		Optional<Usuario> usuario = dao.findById(id);
		dao.deleteById(id);
		return usuario;
	}

	@GetMapping("/{id}")
	public Optional<Usuario> buscarUsuarioPorId(@PathVariable Integer id) {
	    return dao.findById(id);
	}

	@GetMapping("/nome/{nome}")
	public List<Usuario> buscarUsuarioPorNome(@PathVariable String nome) {
	    return dao.findByNomeContainingIgnoreCase(nome); // Busca usuários pelo nome (case insensitive)
	}

	@GetMapping
	public List<Usuario> listarUsuariosOrdenados(String ordem) {
		if ("asc".equalsIgnoreCase(ordem)) {
			return dao.findAllByOrderByNomeAsc(); // Ordena por nome em ordem crescente
		} else if ("desc".equalsIgnoreCase(ordem)) {
			return dao.findAllByOrderByNomeDesc(); // Ordena por nome em ordem decrescente
		} else {
			return (List<Usuario>) dao.findAll(); // Retorna sem ordenação se nenhum parâmetro for passado
		}
	}

}