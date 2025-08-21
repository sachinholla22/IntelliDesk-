package com.ticketsystem.ticketsystem.dto;

import java.util.List;

public class AiResponse {
    private String answer;
    private List<String> sources;

    // getters & setters
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public List<String> getSources() { return sources; }
    public void setSources(List<String> sources) { this.sources = sources; }
}
