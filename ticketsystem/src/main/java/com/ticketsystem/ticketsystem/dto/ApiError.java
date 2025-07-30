package com.ticketsystem.ticketsystem.dto;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class ApiError implements Serializable{
    private int status;
    private String message;
    private String errorCode;

    public ApiError(HttpStatus status,String message, String errorCode){
        this.status = status.value();
        this.message=message;
        this.errorCode=errorCode;
    }
}
