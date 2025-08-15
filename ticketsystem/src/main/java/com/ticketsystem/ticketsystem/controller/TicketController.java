package com.ticketsystem.ticketsystem.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ticketsystem.ticketsystem.dto.ApiWrapper;
import com.ticketsystem.ticketsystem.dto.SingleTicketResponse;
import com.ticketsystem.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.ticketsystem.entity.Ticket;
import com.ticketsystem.ticketsystem.entity.Users;
import com.ticketsystem.ticketsystem.repo.UserRepo;
import com.ticketsystem.ticketsystem.service.TicketService;
import com.ticketsystem.ticketsystem.service.UserService;
import com.ticketsystem.ticketsystem.utils.JwtUtils;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/ticket")
public class TicketController {
    
    private final JwtUtils jwtUtils;
    private final TicketService ticketService;
    private final UserService userService;
    private final UserRepo userRepo;


    public TicketController(JwtUtils jwtUtils, TicketService ticketService, UserService userService,UserRepo userRepo){
        this.jwtUtils=jwtUtils;
        this.ticketService=ticketService;
        this.userService=userService;
        this.userRepo=userRepo;
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping(value="/createticket",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiWrapper<?>> createTicketController( @RequestHeader("Authorization")String authHeader,@Valid @RequestPart("ticket") Ticket ticket, @RequestPart("photo") List <MultipartFile> photos){
        String jwt=authHeader.replace("Bearer ","");
        String userId=jwtUtils.extractUserId(jwt);
        
        Users getOrgId=userRepo.findById(Long.valueOf(userId)).orElseThrow(()->new IllegalArgumentException("No such Users"));
        Long orgId=getOrgId.getOrganization().getId();
        if(!jwtUtils.isTokenValid(jwt, userId, "CLIENT",orgId)){
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiWrapper.error(HttpStatus.UNAUTHORIZED,"Not valid user","UnAuthorized"));
        }
        String response = ticketService. createTicketService(ticket, photos, userId);
        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.CREATED));
    }
    

    @GetMapping("/getTickets")
    public ResponseEntity<ApiWrapper<?>> getNullOpenTicketsController(@RequestHeader("Authorization")String authHeader,@RequestParam("status") String status){

        String jwt=authHeader.replace("Bearer","");
        Long orgId=jwtUtils.extractOrganizationId(jwt);  
        Optional<List<TicketResponseDTO>> ticket=ticketService.getNullOpenTicketService(status,orgId);
        if(ticket.isPresent()){
            return ResponseEntity.ok(ApiWrapper.success(ticket.get(),HttpStatus.OK));
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiWrapper.error(HttpStatus.NOT_FOUND,"No Open Tickets","No Open Tickets"));
        }

    }


    @PostMapping("/{ticketId}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiWrapper<?>> assignTicketController(@RequestHeader("Authorization")String authHeader ,@PathVariable("ticketId")Long ticketId ,@RequestBody Map<String, Object> request){

      String jwt=authHeader.replace("Bearer","");
      String userId=jwtUtils.extractUserId(jwt);
      Users getOrgId=userRepo.findById(Long.valueOf(userId)).orElseThrow(()->new IllegalArgumentException("No such Users"));
      Long orgId=getOrgId.getOrganization().getId();
      if(!jwtUtils.isTokenValid(jwt, userId, "MANAGER",orgId )){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiWrapper.error(HttpStatus.UNAUTHORIZED,"Not valid user","UnAuthorized"));
      }
      Long assignedToId=Long.valueOf(request.get("assignedToId").toString());
      String response=ticketService.assignTicketService(ticketId,Long.valueOf(userId),assignedToId);
      return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.OK));
   
    }

    @GetMapping("/getdevelopers")
    public ResponseEntity<ApiWrapper<?>> getDeveloperController(@RequestHeader("Authorization") String authHeader,@RequestParam("role") String role){

        String jwt=authHeader.replace("Bearer","");
        String userId=jwtUtils.extractUserId(jwt);
        Users getOrgId=userRepo.findById(Long.valueOf(userId)).orElseThrow(()->new UsernameNotFoundException("No such users"));
        Long orgId=getOrgId.getOrganization().getId();
        if(!jwtUtils.isTokenValid( jwt , userId, "MANAGER", orgId)){
            throw new IllegalArgumentException("InValid User or Organization");
        }

        Optional<List<Users>> getDevelopers=userService.getDevelopersService(role,orgId);
        if(getDevelopers.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiWrapper.error(HttpStatus.NOT_FOUND,"No Such Developers","NOT FOUND"));
        }

       return ResponseEntity.status(HttpStatus.OK).body(ApiWrapper.success(getDevelopers,HttpStatus.OK));

    }

    @GetMapping("/overdues")
    public ResponseEntity<ApiWrapper<?>> getOverDuesController(@RequestHeader("Authorization") String authHeader){
     
        String jwt=authHeader.replace("Bearer","");
        Long orgId=jwtUtils.extractOrganizationId(jwt);

        List<TicketResponseDTO> response=ticketService.getOverDuesController(orgId);

        return ResponseEntity.ok(ApiWrapper.success(response,HttpStatus.OK));
        
    }
}
