package org.elevate.services;

import org.springframework.stereotype.Service;
import org.elevate.dtos.AnswerResponseDTO;
import org.elevate.dtos.QuestionRequestDTO;
import org.elevate.dtos.QuestionResponseDTO;
import org.elevate.exceptions.ClubNotFoundException;
import org.elevate.exceptions.UndefinedUserClubException;
import org.elevate.exceptions.UserNotFoundException;
import org.elevate.models.Answer;
import org.elevate.models.Club;
import org.elevate.models.Question;
import org.elevate.models.User;
import org.elevate.repositories.AnswerRepository;
import org.elevate.repositories.ClubRepository;
import org.elevate.repositories.QuestionRepository;
import org.elevate.repositories.UserRepository;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final AnswerRepository answerRepository;

    public QuestionService(QuestionRepository questionRepository, UserRepository userRepository, ClubRepository clubRepository, AnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.answerRepository = answerRepository;
    }

    public Question createQuestion(QuestionRequestDTO questionRequestDTO) throws ClubNotFoundException, UndefinedUserClubException {
        User user = userRepository.findById(questionRequestDTO.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Club club = clubRepository.findById(questionRequestDTO.getClubId())
                .orElseThrow(() -> new ClubNotFoundException("Club not found"));

        AtomicBoolean memberOfTheClub = new AtomicBoolean(false);
        user.getUserClubs().forEach(clubUser -> {
            if(Objects.equals(club.getClubId(), questionRequestDTO.getClubId())) {
                memberOfTheClub.set(true);
            }
        });
        if(!memberOfTheClub.get()) {
            throw new UndefinedUserClubException("User Doesn't belong to the club");
        }
        Question question = new Question();
        question.setTitle(questionRequestDTO.getTitle());
        question.setQuestion(questionRequestDTO.getQuestion());
        question.setClub(club);
        question.setUser(user);
        return questionRepository.save(question);
    }

    public List<QuestionResponseDTO> getQuestionsByClub(Long clubId) {
        // Fetch all questions by Club ID
        List<Question> questions = questionRepository.findByClub_ClubId(clubId);

        // Extract question IDs
        List<Long> questionIds = questions.stream()
                .map(Question::getQuestionId)
                .toList();

        // Fetch all answers for the extracted question IDs
        List<Answer> answers = answerRepository.findByQuestion_QuestionIdIn(questionIds);

        // Map answers to AnswerResponseDTO
        List<AnswerResponseDTO> answerDTOs = answers.stream().map(answer -> {
            AnswerResponseDTO answerDTO = new AnswerResponseDTO();
            answerDTO.setAnswerId(answer.getAnswerId());
            answerDTO.setQuestionId(answer.getQuestion().getQuestionId());
            answerDTO.setUserId(answer.getUser().getUserId());
            answerDTO.setFirstName(answer.getUser().getFirstName());
            answerDTO.setLastName(answer.getUser().getLastName());
            answerDTO.setRole(answer.getUser().getRole());
            answerDTO.setClubId(answer.getClub().getClubId());
            answerDTO.setAnswer(answer.getAnswer());
            answerDTO.setCreatedAt(answer.getCreatedAt());
            answerDTO.setUpdatedAt(answer.getUpdatedAt());
            return answerDTO;
        }).toList();

        // Map answers to their respective questions

        return questions.stream().map(question -> {
            List<AnswerResponseDTO> questionAnswers = answerDTOs.stream()
                    .filter(answerDTO -> answerDTO.getQuestionId().equals(question.getQuestionId()))
                    .toList();

            QuestionResponseDTO dto = new QuestionResponseDTO();
            dto.setQuestionId(question.getQuestionId());
            dto.setClubId(question.getClub().getClubId());
            setUser(dto, question.getUser());
            dto.setUpvoteCount(question.getUpvoteCount());
            dto.setTitle(question.getTitle());
            dto.setQuestion(question.getQuestion());
            dto.setCreatedAt(question.getCreatedAt());
            dto.setUpdatedAt(question.getUpdatedAt());
            dto.setAnswers(questionAnswers);

            return dto;
        }).toList();
    }


    private void setUser(QuestionResponseDTO dto, User user) {
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
    }
}
