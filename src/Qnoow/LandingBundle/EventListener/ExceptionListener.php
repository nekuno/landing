<?php

namespace Qnoow\LandingBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

class ExceptionListener
{
    protected $templating;
    protected $kernel;

    public function __construct(EngineInterface $templating, $kernel)
    {
        $this->templating = $templating;
        $this->kernel = $kernel;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        if ('prod' == $this->kernel->getEnvironment()) {
            $exception = $event->getException();

            $response = new Response();

            $response->setContent(
                $this->templating->render(
                    'QnoowLandingBundle:Exception:exception.html.twig',
                    array('exception' => $exception)
                )
            );

            if ($exception instanceof HttpExceptionInterface) {
                $response->setStatusCode($exception->getStatusCode());
                $response->headers->replace($exception->getHeaders());
            } else {
                $response->setStatusCode(500);
            }

            $event->setResponse($response);
        }
    }
}