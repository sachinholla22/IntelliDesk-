package com.ticketsystem.ticketsystem.dto;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiWrapper<T> implements Serializable{
    private boolean success;
    private int status;
    private T data;
    private ApiError error;


    public static <T>ApiWrapper <T> success(T data,HttpStatus status){
        ApiWrapper<T> response=new ApiWrapper<>();
        int myStatus=status.value();
        response.setSuccess(true);
        response.setStatus(myStatus);
        response.setData(data);
        return response;
    }

    public static <T>ApiWrapper <T> error(HttpStatus status,String message,String errorCode){
         ApiWrapper<T> response=new ApiWrapper<>();
         response.setSuccess(false);
         response.setError(new ApiError(status,message,errorCode));
         return response;

    }

    
}
