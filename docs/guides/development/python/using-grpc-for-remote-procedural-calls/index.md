---
slug: using-grpc-for-remote-procedural-calls
description: 'This guide shows how you can use gRPC, a open source remote procedure call framework which enables cross-platform communications between clients and a central server.'
keywords: ['what is grpc', 'grpc vs rest', 'grpc tutorial']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-30
modified_by:
  name: Linode
title: "Use gRPC and Python for Remote Procedural Calls"
external_resources:
- '[gRPC](https://grpc.io/)'
- '[Google Developers Page for Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview)'
authors: ["Jeff Novotny"]
---

[*gRPC*](https://grpc.io/) is an open-source **remote procedure call** (RPC) framework that enables cross-platform and cross-language communication between clients and a central server. gRPC allows for the specification of a common interface or API to define shared functions, constants, and message types. The server implements the full interface, while clients use stub functions to call the methods in the API. Client and server applications can be written in one of several supported programming languages, which do not have to necessarily match up. This guide introduces and explains gRPC, and describes how to implement an application with remote function calls using gRPC and Python.

## What is a Remote Procedural Call?

A remote procedure call (RPC) is a central concept in distributed computing. It allows one system to call a function in a different address space, or even on a completely different system. If the client and server are running on the same system, they use distinct virtual addressing spaces. Client systems only require a description of the shared interface to interact with the remote system.

RPCs are usually implemented in terms of requests and responses. RPC requests can be either synchronous and blocking, or asynchronous. The client sends a request message to the server and receives a response message in return. From the client's perspective, the service interface it is using is part of the same program or package.

RPCs are obviously slower than calls to the same address space. They can also fail for a variety of reasons, including network problems or a mismatch between interface implementations. These failures can sometimes be difficult to understand and debug, and client applications must be robust enough to handle them.

Many common programming languages provide some level of RPC functionality. In addition to gRPC, other generic RPC utilities include NFS, Etch, Apache Thrift, and several program variants from Microsoft. Most RPC programs encourage the client and server to follow the same sequence of events.

1. The client calls a local stub function that is responsible for communicating with the server.
1. The stub function invokes a system call to transmit the message, including the necessary function parameters as arguments.
1. The client sends the message to the server, which is either on the same system or a remote component.
1. The server receives the message and passes it to a server stub.
1. The server stub processes the message and extracts the parameters.
1. The server stub calls a function to handle the request and the task runs to completion.
1. When processing is complete, the reply is transmitted. The previous six steps reoccur in the opposite direction. The server calls a stub function to transmit the message. The client receives the message and finally passes the information to the stub that originally made the request.

## What is gRPC?

gRPC is a specific implementation of RPC. It allows different machines, running applications that might be written in different languages, to communicate. The simplicity and efficiency of its design are useful for implementing microservices, where the server provides specific and finely-tuned services to multiple independent clients.

gRPC accomplishes this task through the use of protocol buffers, also known as **protobufs**. Protocol buffers were originally developed by Google. They are small, efficient, and can be transmitted and processed quickly. These buffers provide gRPC with an **Interface Definition Language** (IDL) and a message-exchange format. More information about protocol buffers can be found on the [Google Developers Page for Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview). The Google site also includes a [*Protocol Buffers Language Specification*](https://developers.google.com/protocol-buffers/docs/reference/proto3-spec).

Application developers can use gRPC's protocol buffers to design a service interface. This interface consists of all the available methods, along with a definition of each message type. This interface definition allows a client application to call a method that is running remotely on the server. These components are defined in a `.proto` file, which is written in plain text. Every protocol buffer entry is structured as a **message**. Each message defines a list of **fields**, and each field consists of a name-value pair. The protocol buffer compiler **protoc** is used to translate the `.proto` file into two source files in the target programming language. These files serve as an infrastructure library containing classes and data access methods, along with handlers for the protocol buffers. The client and server designers independently use these files to develop their applications.

In addition to running on different hosts, the client and the server can use different languages for the implementation. Some of these supported languages include C++, Go, Java, Kotlin, Node, PHP, and Python. A full list of all languages and their documentation can be found on the [gRPC Supported Languages Page](https://grpc.io/docs/languages/).

gRPC uses HTTP/2 to leverage the availability of longer-lasting parallel connections. In most applications, the bulk of the implementation happens on the server-side. The gRPC server application instantiates a server to accept incoming requests, implements the methods defined in the interface, and transmits responses. The server continues to poll for requests as long as it is running, and can serve many clients simultaneously. The client-side implementation is usually more straightforward. It consists of one or more stub functions that construct and transmit messages to the server and block while waiting for a response. There is usually one stub for each method in the interface.

Several types of gRPC services are supported:

- ****Simple RPC:**** This is the most straightforward type of interface. A client uses a stub function to synchronously transmit a message to the server. It then waits for a response.

- ****Response-streaming RPC:**** In this interface, the client transmits a request to the server in the same way as a simple RPC. However, it receives a stream in return, which it can process as a list of messages.

- ****Request-streaming RPC:**** In this case, the client transmits a sequence of messages to the server in the form of a stream. It then waits for a response from the server.

- ****Bidirectionally-streaming RPC:**** This architecture combines aspects of the response-streaming and request-streaming RPCs. Both the client and server transmit a stream of messages asynchronously and independently and process the messages independently.

**## Advantages of gRPC**

gRPC has many advantages over traditional client-server architectures.

- It permits the development of highly-scaled and distributed systems incrementally.
- It facilitates rapid development and prototyping. Developers can begin with a simple API and receive direct feedback. As the system develops, more functionality can be added to the same interface without affecting the original methods.
- It offers language-independent communication, so client developers can write their programs in any language they are comfortable and familiar with. They do not have to know what language the client application uses, or how to program in it.
- Clients can develop their own implementation independent of each other. Because each method is called independently, clients are only required to use stubs for the functions they care about. They can ignore the remainder of the interface.
- It yields good performance and low latency, partly due to its use of HTTP/2. The protocol buffers are efficient and lightweight and can be transmitted and processed quickly.
- gRPC provides advanced features such as authentication and load balancing to enhance security and performance.

## gRPC vs REST

gRPC is often compared and contrasted with **Representational State Transfer** (REST). REST also uses a client-server architecture. Both systems are useful for implementing microservices. However, there are major differences between the two technologies.

- REST does not use RPCs. In a RESTful system, a client sends a request to a remote **Uniform Resource Identifier** (URI). It later receives a response encoded in XML, HTML, JSON, or another similar format. The request and reply typically use HTTP/HTTPS methods such as `GET` and `POST`.
- All browsers support REST, and it is widely used throughout the internet. gRPC has more limited web capabilities. **gRPC Web** does provide some measure of web support. (gRPC Web is explained in the [next section](/docs/guides/using-grpc-for-remote-procedural-calls/#grpc-web)). In general, REST is more commonly used for web applications, while gRPC is used inside internal networks. gRPC is also frequently used in embedded systems, facilitating communication between the different components of the device.
- gRPC uses HTTP/2 and can take advantage of its inherent client-response communication model. This allows it to transmit requests or responses via a stream. REST uses HTTP version 1.1 and has to handle one request at a time using inefficient short-lived connections.
- Performance is better with gRPC compared to REST. It also more efficiently uses bandwidth due to its lightweight design.
- gRPC can be quickly translated into the target programming language for the application using the protoc compiler. REST does not have an equivalent feature, although third-party tools can streamline the process somewhat.
- REST can be implemented in HTTP without additional tools. gRPC programs require the protoc compiler, and the `.proto` files must be compiled into the final programming language before they can be used. The client and server applications cannot be fully written or tested until the interface is defined and the auto-generated files are available.

## gRPC Web

[gRPC Web](https://github.com/grpc/grpc-web) is an attempt to address the lack of web support for gRPC. It is a JavaScript version of gRPC that is designed for web clients. gRPC Web also requires a complex web proxy to connect to RPC services. It currently uses [*Envoy*](https://www.envoyproxy.io/) as the default proxy, but in-house work is in progress on a Java implementation. gRPC Web is currently a work in progress, and more language-specific frameworks are expected soon. For more information about how to develop gRPC Web applications, see the [gRPC Web documentation](https://grpc.io/docs/platforms/web/).

## Create a gRPC Project in Python for Remote Procedural Calls**

This tutorial demonstrates the steps required to build a working gRPC application using Python. Some basic knowledge of Python is required to understand and contextualize the material. The simple **Teams** application accepts an incoming request from a client that contains the name of a city. It uses the city name to retrieve the name of the fictitious sports team that is located there from its internal dictionary. Finally, it transmits a multi-field message back to the client containing the name of the city and the nickname of the team.

This simple RPC application accepts a single request and returns a single response. No streams are involved in this application, but the guide explains how a stream-based method could work in each step. Both the server and client are implemented in Python, but any one of the supported languages could potentially be used on either side. Also, both the server and client here run on the same server in different code spaces. A more realistic server application would probably pull its data from an external database rather than a hard-coded dictionary.

Extensive information about using gRPC with Python can be found in [gRPC's Python Documentation](https://grpc.io/docs/languages/python/). This page contains links to a series of resources, including the gRPC Python API and a basic tutorial.

{{< note respectIndent=false >}}
The following example uses an insecure communication channel between the client and the server. To enhance the security of gRPC applications, consult the [gRPC Authentication Documentation](https://grpc.io/docs/guides/auth/).
{{< /note >}}

### A Summary of the gRPC Application Creation Process

This procedure is geared towards Ubuntu users but is generally applicable to all Linux distributions. The application development process follows these steps:

1. ****Install Python:**** If Python is already installed on the system, skip to the second step.
1. ****Install the Python gRPC Tools:**** These tools install the protoc compiler and other necessary components.
1. ****Create the Proto File and Generate the Python Stubs:**** All RPC projects start with a `.proto` file containing definitions for the service interface, including the message types and methods. The `protoc` compiler is used to generate two infrastructure files for the client and server.
1. ****Implement the gRPC Server:**** The gRPC server code launches the server and implements the methods from the service interface. A function is required for each method specified in the interface.
1. ****Implement the gRPC Client:**** The client code includes Python stub functions to initiate a connection to the server, generate requests, and receive the responses.
1. ****Run and Test the gRPC Application:**** Launch the server and start the client. Ensure the application generates the expected results.

**### Before You Begin**

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

### Install Python**

In this example, Python is used to write the code for both the client and server. Instructions on how to create a gRPC application using C, C++, Go, Java, PHP, and other languages can be found on the [gRPC Languages page](https://grpc.io/docs/languages/).

1. Verify whether Python is installed on the Linode using the command below. If Python version 3.7 or later is installed, skip to the next section.

        python3 ––version
1. Refresh the Ubuntu repository.

        sudo apt update
1. Install the Python application along with its pip component.

        sudo apt install python3-dev python3-pip

1. Confirm the version of both Python and pip. Pip version 9.0.1 or higher is required to run gRPC.

        python3 --version
        pip3 --version

    {{< output >}}
Python 3.8.5

pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.8)
    {{< /output >}}

### Install the Python gRPC Tools

To use gRPC, install the `grpc` components using pip. If the command is prefaced with `sudo`, these packages are installed system-wide. Otherwise, they are only installed inside your local Python instance.

1. Install gRPC.

        sudo python3 -m pip install grpcio
    {{< output >}}
Installing collected packages: grpcio
Successfully installed grpcio-1.38.0
    {{< /output >}}
1. Install the gRPC tools. This also installs the protocol buffer compiler protoc.

        sudo python3 -m pip install grpcio-tools
    {{< output >}}
Installing collected packages: protobuf, grpcio-tools
Successfully installed grpcio-tools-1.38.0 protobuf-3.17.3
    {{< /output >}}

### Create the Proto File and Generate the Python Stubs

The next step is to complete the `.proto` file, which serves as an API between the client and server. This file contains declarations for the interface methods, and indicates the parameters and return values. It also defines the message types used for client-server communication, and possibly some shared enumerations and definitions.

1. Create the main directory for the project named `teams`. Inside this directory, create another directory named `protobufs`.
1. Change the working directory to `teams/protobufs` and create a file named `teams.proto`.

        cd teams/protobufs
        touch teams.proto

1. The `teams.proto` file contains a shared API that the client and server can use to communicate with one another. At the top of the file, declare the `syntax` attribute as `proto3`.
    {{< note respectIndent=false >}}
For simplicity, this example does not use packages. If there are multiple projects in the same Python workspace, add this code to a package to avoid naming conflicts.
    {{< /note >}}
    {{< file "~/teams/protobufs/teams.proto" >}}
syntax = "proto3";
    {{< /file >}}
1. Define the `TeamRequest` message, which consists of a single field of type `string`. This message type is used for the client request. The `TeamResponse` message contains two fields, one for the `city` and the second for the `nickname` of the team. It defines the message that the server sends back to the client in response.
    {{< file "~/teams/protobufs/teams.proto" >}}
// The request message is a string containing the city name.
message TeamRequest {
  string city = 1;
}

// The response message contains the name of the city and the name of the team that plays there.
message TeamResponse {
  string city = 1;
  string nickname = 2;
}
   {{< /file >}}

1. The final section of the file defines the  `Teams` service and any shared `rpc` methods. In this case, `Teams` only contains the `GetTeam` method. This method accepts a message parameter of type `TeamRequest` and returns a message of type `TeamResponse`. The client can call this function on the server using an auto-generated stub method.

    {{< file "~/teams/protobufs/teams.proto" >}}
// The teams service definition.
service Teams {
  // Returns the city and nickname of a team based on a string from the client
  rpc GetTeam (TeamRequest) returns (TeamResponse) {}
}
   {{< /file >}}
1. Following is an overview of the entire `teams.proto` file.

    {{< file "~/teams/protobufs/teams.proto" >}}
syntax = "proto3";

// The request message is a string containing the type name.
message TeamRequest {
  string city = 1;
}

// The response message contains the name of the city and the name of the team that plays there.
message TeamResponse {
  string city = 1;
  string nickname = 2;
}
// The teams service definition.
service Teams {
  // Returns the city and nickname of a team based on a string from the client.
  rpc GetTeam (TeamRequest) returns (TeamResponse) {}
}
   {{< /file >}}

1. Before this interface can be used by other Python files, it must be compiled into Python stub files. Run the following command from the main `teams` directory to do so. The `-I` parameter indicates the location of the `protobufs` directory. The final variable is the location of the main `teams.proto` file. The destination for the auto-generated files is specified by `python_out` and `grpc_python_out` and can be set to the current directory.

        python3 -m grpc_tools.protoc -I ./protobufs --python_out=. --grpc_python_out=. ./protobufs/teams.proto

1. After compilation of the `.proto` file, the `teams` directory should contain Python files named `teams_pb2.py` and `teams_pb2_grpc.py`. These files contain auto-generated classes for the messages and the service. Make a note of these file names to reference them again later.
    {{< note type="alert" respectIndent=false >}}
Do not edit either of the auto-generated files. This could render them unusable.
    {{< /note >}}

{{< note respectIndent=false >}}
To create a response-streaming, request-streaming, or bidirectionally-streaming RPC, declare the message to be streamed as a `stream`. For instance, to allow `GetTeam` to return a stream of team messages, declare it using the following format:

    rpc GetTeam (TeamRequest) returns (stream TeamResponse) {}.
{{< /note >}}

### Implement the gRPC Server

The server application is responsible for implementing every function defined inside the `.protos` file. To accomplish this, it must import the auto-generated files and the `grpc` package. The server file must also define a `serve` function. This is called upon startup and runs for the duration of the program.

1. Create a file named `teams_server.py` inside the main `teams` directory.

1. At the top of the file, `import` the required packages. To import the auto-generated classes, add an `import` statement corresponding to the filename of each auto-generated file, minus the `.py` extension.

    {{< file "~/teams/teams_server.py" python >}}
from concurrent import futures
import logging

import grpc

import teams_pb2
import teams_pb2_grpc
    {{< /file >}}

1. Create the main class, following these guidelines:
    - The name of the `class` is the name of the `service` from the `.protos` file. In this case, the service name is `Teams`.
    - As a parameter, it accepts a `servicer` for the class. The name of the `servicer` follows the format `<name-of-the-grpc-class>.<name-of-the-class>Servicer`, for instance, `teams_pb2_grpc.TeamsServicer`.
    - The `class` must implement all RPC methods defined within the API. In this case, the only method to implement is `GetTeam`.
    - In addition to the mandatory `self` object, the `GetTeam` method takes two additional parameters, `request` and `context`. The `request` parameter contains the `TeamRequest` message sent by the client. The fields inside this message follow the definition from the `.proto` file. The `context` parameter contains RPC-specific metadata about the request.
    - The function itself is simple. The information from the client is referenced through the `request.city` field. The `city` field was defined within the `TeamRequest` message declaration inside `teams.proto`.
    - At the end of the function, the relevant information is returned using the `teams_pb2.TeamResponse` structure. The format of the `TeamResponse` message was declared inside `teams.proto`. Set a value for each message field using the format `<fieldname>=<value>`, for example, `nickname=team_name`.
    - For the purposes of this demo application, `GetTeam` prints the incoming metadata when a message is received. This is useful for debugging purposes as well as documenting the timing and nature of the client requests.

    {{< file "~/teams/teams_server.py" python >}}
class Teams(teams_pb2_grpc.TeamsServicer):

    def GetTeam(self, request, context):

        metadata = dict(context.invocation_metadata())
        print(metadata)
        teamList = { 'Chicago' : 'Jackals',
                     'Detroit' : 'Wheels',
                     'Minneapolis' : 'Nordics',
                     'New York' : 'Metros',
                     'Arizona' : 'Roadrunners',
                     'San Francisco' : 'Stingers',
                     'Seattle' : 'Orcas',
                     'Los Angeles' : 'Pumas',
                     'Philadelphia' : 'Foxes',
                     'Boston' : 'Revolutionaries' }
        if request.city in teamList:
            team_name = teamList[request.city]
        else:
            team_name = 'not a member'
        return teams_pb2.TeamResponse(city=request.city, nickname=team_name)
    {{< /file >}}

1. The server must handle all client calls. This is the responsibility of the `serve` function. It creates the server, attaches a `servicer` to it, and tells it to listen for incoming messages on port `50051`. The `serve` function follows the same basic format in every gRPC application. The second line of the `serve` function is complicated. It uses the `add_TeamsServicer_to_server` method from the `teams_pb2_grpc` class. This method takes a `Teams` object and the `server` itself as parameters.
    {{< file "~/teams/teams_server.py" python >}}
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    teams_pb2_grpc.add_TeamsServicer_to_server(Teams(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()
    {{< /file >}}
1. The file ends with a simple `main` function that only exists to call `serve`. Although `server.start` is non-blocking and runs inside its own thread, `wait_for_termination` blocks the caller as long as the server is running.
    {{< file "~/teams/teams_server.py" python >}}
if **__name__** == '**__main__**':
    logging.basicConfig()
    serve()
    {{< /file >}}
1. The entire `teams_server.py` file is shown here for reference.

   {{< file "~/teams/teams_server.py" python >}}
from concurrent import futures
import logging

import grpc

import teams_pb2
import teams_pb2_grpc
class Teams(teams_pb2_grpc.TeamsServicer):

    def GetTeam(self, request, context):
        metadata = dict(context.invocation_metadata())
        print(metadata)
        teamList = { 'Chicago' : 'Jackals',
                     'Detroit' : 'Wheels',
                     'Minneapolis' : 'Nordics',
                     'New York' : 'Metros',
                     'Arizona' : 'Roadrunners',
                     'San Francisco' : 'Stingers',
                     'Seattle' : 'Orcas',
                     'Los Angeles' : 'Pumas',
                     'Philadelphia' : 'Foxes',
                     'Boston' : 'Revolutionaries' }
        if request.city in teamList:
            team_name = teamList[request.city]
        else:
            team_name = 'not a member'
        return teams_pb2.TeamResponse(city=request.city, nickname=team_name)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    teams_pb2_grpc.add_TeamsServicer_to_server(Teams(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if **__name__** == '**__main__**':
    logging.basicConfig()
    serve()
    {{< /file >}}

{{< note respectIndent=false >}}
To return a stream of teams, `GetTeam` would `yield` each response message rather than returning it. Typically, the routine would iterate over the entire database or dictionary using a `for ... in` control structure and would `yield` each relevant entry in turn. This line would then become `yield teams_pb2.TeamResponse(city=tmp_city_name, nickname=tmp_team_name)`.
{{< /note >}}

### Implement the gRPC Client

In most cases, the client is much simpler than the server. The main function invokes `run`, which executes the calls to the server. In a real-life, the input information would come from the user via the command line. To simplify the program, the server calls use hard-coded input values.

1. Create a file named `teams_client.py` inside the main `teams` directory.
1. At the top of the file, `import` the required packages. This section is similar to the corresponding section of the server file.

    {{< file "~/teams/teams_client.py" python >}}
from **__future__** import print_function
import logging

import grpc

import teams_pb2
import teams_pb2_grpc
    {{< /file >}}

1. Create the `run` function. This function is not part of any class, although it uses classes from the auto-generated files.
    - Create a channel using `grpc.insecure_channel`. This example assumes the client and server are running on the same system. To connect with a gRPC server on a remote system, replace `localhost` with the gRPC server's IP address in this example.
    - Create a local stub object using `teams_pb2_grpc.TeamStub`, passing it to the channel. This stub is used to call the methods defined in the `.proto` file.
    - The `stub` possesses a method for each function in the service interface. Use the `stub.GetTeam` method to invoke the `GetTeam` function on the server. The `GetTeam` method accepts a `teams_pb2.TeamRequest` message as a parameter. Populate the `TeamRequest` message by passing it a field-value pair, such as `city='Chicago'`, for each field.
    - The results can be extracted from the `response` object returned by the server. For example, use `response.nickname` to access the value of the `nickname` field.

    {{< file "~/teams/teams_client.py" python >}}
def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = teams_pb2_grpc.TeamsStub(channel)
        response = stub.GetTeam(teams_pb2.TeamRequest(city='Chicago'))
        print("Teams client received: " + response.city + response.nickname)
        response = stub.GetTeam(teams_pb2.TeamRequest(city='Philadelphia'))
        print("Teams client received: " + response.city + response.nickname)
        response = stub.GetTeam(teams_pb2.TeamRequest(city='Miami'))
        print("Teams client received: " + response.city + response.nickname)
    {{< /file >}}
1. The main function logs some information and then calls `run`. The `run` function is non-blocking, so when it is finished, the program ends.
    {{< file "~/teams/teams_client.py" python >}}
if **__name__** == '**__main__**':
    logging.basicConfig()
    run()
    {{< /file >}}
1. The entire `teams_client.py` file is shown here.

    {{< file "~/teams/teams_client.py" python >}}
from **__future__** import print_function
import logging

import grpc

import teams_pb2
import teams_pb2_grpc

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = teams_pb2_grpc.TeamsStub(channel)
        response = stub.GetTeam(teams_pb2.TeamRequest(city='Chicago'))
        print("Teams client received: " + response.city + " " + response.nickname)
        response = stub.GetTeam(teams_pb2.TeamRequest(city='Philadelphia'))
        print("Teams client received: " + response.city + " " + response.nickname)
        response = stub.GetTeam(teams_pb2.TeamRequest(city='Miami'))
        print("Teams client received: " + response.city + " " + response.nickname)

if **__name__** == '**__main__**':
    logging.basicConfig()
    run()
    {{< /file >}}

{{< note respectIndent=false >}}
If `GetTeam` returned a stream, the `stub.GetTeam` function call would have received a list of messages in response. The client would then process these messages, possibly with a Python list comprehension or a `for ... in` control structure.
{{< /note >}}

### Run and Test the gRPC Application

The server and the client are launched like any other Python program. Ensure the server program is started first. The server blocks run indefinitely until it is terminated, so it does not appear to be doing anything until it receives a client request.

1. From the `teams` directory, run the `teams_server.py` Python application. The application should start running, but it should not display any output yet.

        cd teams
        python3 teams_server.py
1. Open a new console on the Linode. Change to the `teams` directory, and run the `teams_client.py` program.

        cd teams
        python3 teams_client.py
1. The `teams_client.py` application displays the results of the remote procedural calls it made to the server. The program terminates when it has printed all of the results.

    {{< output >}}
Teams client received: Chicago Jackals
Teams client received: Philadelphia Foxes
Teams client received: Miami not a member
    {{< /output >}}
1. Return to the window where you launched the `teams_server` application. The program should still be running. The contents of the window should display the metadata from the client requests.

    {{< output >}}
{'user-agent': 'grpc-python/1.38.0 grpc-c/16.0.0 (linux; chttp2)'}
{'user-agent': 'grpc-python/1.38.0 grpc-c/16.0.0 (linux; chttp2)'}
{'user-agent': 'grpc-python/1.38.0 grpc-c/16.0.0 (linux; chttp2)'}
    {{< /output >}}
1. When you are finished using the gRPC client, enter `Ctrl-C` in the same console to terminate the application. The server can be restarted at any time.