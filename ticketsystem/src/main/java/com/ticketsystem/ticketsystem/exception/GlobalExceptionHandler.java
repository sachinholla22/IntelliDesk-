package com.ticketsystem.ticketsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ticketsystem.ticketsystem.dto.ApiError;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentialsError(BadCredentialsException e){
   ApiError error=new ApiError(HttpStatus.BAD_REQUEST,"Bad Credentials" , e.getMessage());
   return ResponseEntity.ok(error);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGlobalException(Exception e){
           ApiError error=new ApiError(HttpStatus.INTERNAL_SERVER_ERROR,"Internal Server Error!" , e.getMessage());
           return ResponseEntity.ok(error);

    }

}
