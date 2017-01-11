<?php

namespace Qnoow\AppBundle\DBAL;

use Doctrine\DBAL\Connection as BaseConnection;
use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Configuration;
use Doctrine\Common\EventManager;

class Connection extends BaseConnection
{
    public function __construct(array $params, Driver $driver, Configuration $config = null, EventManager $eventManager = null)
    {

        if (isset($params['driverOptions']['engine'])) {
            $params['defaultTableOptions']['engine'] = $params['driverOptions']['engine'];
        }

        return parent::__construct($params, $driver, $config, $eventManager);
    }
}